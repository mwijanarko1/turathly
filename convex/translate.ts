"use node";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { internalAction } from "./_generated/server";
import { getResponseText, parseJsonResponse } from "./lib/ai";

type TranslationResponse = {
  translations?: Array<{
    segmentId?: string;
    translation?: string;
  }>;
};

function requireGoogleApiKey() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY. Add it to the Convex environment before running translation.");
  }

  return apiKey;
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

const TRANSLATION_SYSTEM_PROMPT = `You are an expert translator of classical Islamic texts from Arabic to English.

Your goal is to produce high-quality scholarly first drafts.
Produce context-aware, meaning-aware translations—not literal word substitutions.
Capture the scholarly meaning and intent. Preserve technical terminology where appropriate.
Consider surrounding paragraphs for context. Adapt your register to the genre (e.g., tafsir, fiqh, theology).

Example:
Arabic: سد الذرائع
Literal: blocking the means
Meaning-aware: preventing actions that lead to harm`;

function buildPrompt(
  genre: string,
  segments: Array<{
    _id: Id<"segments">;
    text: string;
  }>,
  allSegments: Array<{
    _id: Id<"segments">;
    text: string;
  }>
) {
  const payload = segments.map((segment) => {
    const currentIndex = allSegments.findIndex((candidate) => candidate._id === segment._id);
    const prevSegments = allSegments
      .slice(Math.max(0, currentIndex - 2), currentIndex)
      .map((candidate) => candidate.text);
    const nextSegments = allSegments
      .slice(currentIndex + 1, currentIndex + 3)
      .map((candidate) => candidate.text);

    return {
      segmentId: segment._id,
      prompt: `${TRANSLATION_SYSTEM_PROMPT}

Genre: ${genre}

Context (preceding segments):
${prevSegments.join("\n") || "(none)"}

Segment to translate:
${segment.text}

Context (following segments):
${nextSegments.join("\n") || "(none)"}`,
    };
  });

  return `Return JSON only with this shape:
{ "translations": [{ "segmentId": "segment-id", "translation": "translated text" }] }

Translate every item in this payload. Produce meaning-aware scholarly drafts, not literal translations:
${JSON.stringify(payload)}`;
}

export const translateDocument = internalAction({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.documents.updateStatus, {
      id: args.documentId,
      status: "translating",
      errorMessage: undefined,
    });

    try {
      const metadata = await ctx.runQuery(internal.documents.getForProcessing, {
        documentId: args.documentId,
      });
      if (!metadata?.document) {
        throw new Error("Document not found");
      }

      const segments = await ctx.runQuery(internal.segments.listByDocumentInternal, {
        documentId: args.documentId,
      });

      if (segments.length === 0) {
        await ctx.runMutation(internal.documents.updateStatus, {
          id: args.documentId,
          status: "ready",
          errorMessage: undefined,
        });
        return;
      }

      const genre = metadata.project?.genre ?? "general";
      const client = new GoogleGenerativeAI(requireGoogleApiKey());
      const model = client.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 8192,
        },
      });

      for (const segmentBatch of chunk(segments, 5)) {
        const result = await model.generateContent(buildPrompt(genre, segmentBatch, segments));
        const responseText = getResponseText(result.response, "Translation model");
        const parsed = parseJsonResponse<TranslationResponse>(responseText, "Translation model");

        const translationMap = new Map(
          (parsed.translations ?? [])
            .filter((item): item is { segmentId: string; translation: string } =>
              Boolean(item.segmentId && typeof item.translation === "string")
            )
            .map((item) => [item.segmentId, item.translation.trim()])
        );

        await ctx.runMutation(internal.translations.createBatch, {
          translations: segmentBatch.map((segment) => ({
            segmentId: segment._id,
            translation: translationMap.get(segment._id) ?? "",
            aiGenerated: true,
            editedByUser: false,
          })),
        });
      }

      await ctx.runMutation(internal.documents.updateStatus, {
        id: args.documentId,
        status: "ready",
        errorMessage: undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Translation failed";
      await ctx.runMutation(internal.documents.updateStatus, {
        id: args.documentId,
        status: "error",
        errorMessage: message,
      });
      throw error;
    }
  },
});

export const translatePage = internalAction({
  args: {
    documentId: v.id("documents"),
    pageNumber: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.documents.updateStatus, {
      id: args.documentId,
      status: "translating",
      errorMessage: undefined,
    });

    try {
      const metadata = await ctx.runQuery(internal.documents.getForProcessing, {
        documentId: args.documentId,
      });
      if (!metadata?.document) {
        throw new Error("Document not found");
      }

      const segments = await ctx.runQuery(internal.segments.listByPageInternal, {
        documentId: args.documentId,
        pageNumber: args.pageNumber,
      });

      if (segments.length === 0) {
        return;
      }

      const allSegments = await ctx.runQuery(internal.segments.listByDocumentInternal, {
        documentId: args.documentId,
      });
      const genre = metadata.project?.genre ?? "general";
      const client = new GoogleGenerativeAI(requireGoogleApiKey());
      const model = client.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 8192,
        },
      });

      for (const segmentBatch of chunk(segments, 5)) {
        const result = await model.generateContent(buildPrompt(genre, segmentBatch, allSegments));
        const responseText = getResponseText(result.response, "Translation model");
        const parsed = parseJsonResponse<TranslationResponse>(responseText, "Translation model");

        const translationMap = new Map(
          (parsed.translations ?? [])
            .filter((item): item is { segmentId: string; translation: string } =>
              Boolean(item.segmentId && typeof item.translation === "string")
            )
            .map((item) => [item.segmentId, item.translation.trim()])
        );

        await ctx.runMutation(internal.translations.createBatch, {
          translations: segmentBatch.map((segment) => ({
            segmentId: segment._id,
            translation: translationMap.get(segment._id) ?? "",
            aiGenerated: true,
            editedByUser: false,
          })),
        });
      }

      await ctx.runMutation(internal.documents.updateStatus, {
        id: args.documentId,
        status: "ready",
        errorMessage: undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Translation failed";
      await ctx.runMutation(internal.documents.updateStatus, {
        id: args.documentId,
        status: "error",
        errorMessage: `Page ${args.pageNumber} translation: ${message}`,
      });
      throw error;
    }
  },
});
