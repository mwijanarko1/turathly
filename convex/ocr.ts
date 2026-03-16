"use node";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { getResponseText, parseJsonResponse } from "./lib/ai";

type OcrSegment = {
  text: string;
  bbox: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  orderIndex: number;
};

type OcrResponse = {
  pageCount?: number;
  pages?: Array<{
    pageNumber?: number;
    segments?: OcrSegment[];
  }>;
};

const OCR_PROMPT = `You are processing an Arabic PDF for text extraction.
Return JSON only: { "pageCount": N, "pages": [{ "pageNumber": 1, "segments": [{ "text": "...", "bbox": { "x": 0.05, "y": 0.1, "w": 0.9, "h": 0.08 }, "orderIndex": 0 }] }] }
Extract at paragraph level. Normalize all bbox values 0–1. Preserve RTL reading order.`;

function buildSinglePageOcrPrompt(pageNumber: number) {
  return `You are processing an Arabic PDF for text extraction.
Extract text ONLY from page ${pageNumber}. Ignore all other pages.
Return JSON only: { "pageCount": 1, "pages": [{ "pageNumber": ${pageNumber}, "segments": [{ "text": "...", "bbox": { "x": 0.05, "y": 0.1, "w": 0.9, "h": 0.08 }, "orderIndex": 0 }] }] }
Extract at paragraph level. Normalize all bbox values 0–1. Preserve RTL reading order.`;
}

function requireGoogleApiKey() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY. Add it to the Convex environment before running OCR.");
  }

  return apiKey;
}

function normalizeNumber(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

function normalizeSegments(documentId: string, response: OcrResponse) {
  const pages = (response.pages ?? [])
    .map((page, pageIndex) => ({
      pageNumber: page.pageNumber ?? pageIndex + 1,
      segments: (page.segments ?? [])
        .filter((segment) => segment.text?.trim())
        .map((segment, segmentIndex) => ({
          documentId,
          pageNumber: page.pageNumber ?? pageIndex + 1,
          text: segment.text.trim(),
          bbox: {
            x: normalizeNumber(segment.bbox?.x ?? 0),
            y: normalizeNumber(segment.bbox?.y ?? 0),
            w: normalizeNumber(segment.bbox?.w ?? 1),
            h: normalizeNumber(segment.bbox?.h ?? 0),
          },
          orderIndex: Number.isFinite(segment.orderIndex) ? segment.orderIndex : segmentIndex,
        }))
        .sort((left, right) => left.orderIndex - right.orderIndex),
    }))
    .sort((left, right) => left.pageNumber - right.pageNumber);

  return {
    pageCount: response.pageCount ?? pages.length,
    pages,
  };
}

export const processDocument = internalAction({
  args: {
    documentId: v.id("documents"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.documents.updateStatus, {
      id: args.documentId,
      status: "ocr_processing",
      errorMessage: undefined,
    });

    try {
      const blob = await ctx.storage.get(args.storageId);
      if (!blob) {
        throw new Error("Uploaded PDF not found in Convex storage.");
      }

      const pdfBase64 = Buffer.from(await blob.arrayBuffer()).toString("base64");
      const client = new GoogleGenerativeAI(requireGoogleApiKey());
      const model = client.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
          maxOutputTokens: 65536,
        },
      });

      const result = await model.generateContent([
        { text: OCR_PROMPT },
        {
          inlineData: {
            mimeType: blob.type || "application/pdf",
            data: pdfBase64,
          },
        },
      ]);

      const responseText = getResponseText(result.response, "OCR model");
      const parsed = parseJsonResponse<OcrResponse>(responseText, "OCR model");
      const normalized = normalizeSegments(args.documentId, parsed);

      await ctx.runMutation(internal.translations.clearByDocument, {
        documentId: args.documentId,
      });
      await ctx.runMutation(internal.segments.clearByDocument, {
        documentId: args.documentId,
      });

      for (const page of normalized.pages) {
        if (page.segments.length === 0) {
          continue;
        }

        await ctx.runMutation(internal.segments.batchCreate, {
          segments: page.segments,
        });
      }

      await ctx.runMutation(internal.documents.updateStatus, {
        id: args.documentId,
        status: "ocr_complete",
        pageCount: normalized.pageCount,
        errorMessage: undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "OCR failed";
      await ctx.runMutation(internal.documents.updateStatus, {
        id: args.documentId,
        status: "error",
        errorMessage: message,
      });
      throw error;
    }
  },
});

export const processSinglePage = internalAction({
  args: {
    documentId: v.id("documents"),
    storageId: v.id("_storage"),
    pageNumber: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.documents.updateStatus, {
      id: args.documentId,
      status: "ocr_processing",
      errorMessage: undefined,
    });

    try {
      const blob = await ctx.storage.get(args.storageId);
      if (!blob) {
        throw new Error("Uploaded PDF not found in Convex storage.");
      }

      const pdfBase64 = Buffer.from(await blob.arrayBuffer()).toString("base64");
      const client = new GoogleGenerativeAI(requireGoogleApiKey());
      const model = client.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
          maxOutputTokens: 65536,
        },
      });

      const prompt = buildSinglePageOcrPrompt(args.pageNumber);
      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: blob.type || "application/pdf",
            data: pdfBase64,
          },
        },
      ]);

      const responseText = getResponseText(result.response, "OCR model");
      const parsed = parseJsonResponse<OcrResponse>(responseText, "OCR model");
      const normalized = normalizeSegments(args.documentId, parsed);

      await ctx.runMutation(internal.segments.clearByPage, {
        documentId: args.documentId,
        pageNumber: args.pageNumber,
      });

      const pageData = normalized.pages.find((p) => p.pageNumber === args.pageNumber);
      if (pageData && pageData.segments.length > 0) {
        await ctx.runMutation(internal.segments.batchCreate, {
          segments: pageData.segments,
        });
      }

      await ctx.runMutation(internal.documents.updateStatus, {
        id: args.documentId,
        status: "ocr_complete",
        errorMessage: undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "OCR failed";
      await ctx.runMutation(internal.documents.updateStatus, {
        id: args.documentId,
        status: "error",
        errorMessage: `Page ${args.pageNumber} OCR: ${message}`,
      });
      throw error;
    }
  },
});
