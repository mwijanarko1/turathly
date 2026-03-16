import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  getAuthorizedDocument,
  requireAuthorizedDocument,
  requireAuthorizedProject,
} from "./lib/auth";

async function hydrateDocumentUrl<
  T extends {
    fileUrl: string;
    storageId?: Id<"_storage">;
  },
>(ctx: { storage: { getUrl(storageId: Id<"_storage">): Promise<string | null> } }, document: T): Promise<T> {
  if (!document.storageId) {
    return document;
  }

  const fileUrl = await ctx.storage.getUrl(document.storageId);
  return {
    ...document,
    fileUrl: fileUrl ?? document.fileUrl,
  };
}

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const authorized = await requireAuthorizedProject(ctx, args.projectId).catch(() => null);
    if (!authorized) {
      return [];
    }

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();

    return await Promise.all(documents.map((document) => hydrateDocumentUrl(ctx, document)));
  },
});

export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const result = await getAuthorizedDocument(ctx, args.id);
    if (!result) {
      return null;
    }

    return await hydrateDocumentUrl(ctx, result.document);
  },
});

export const getForProcessing = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      return null;
    }

    const project = await ctx.db.get(document.projectId);
    return {
      document,
      project,
    };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    fileUrl: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuthorizedProject(ctx, args.projectId);

    let fileUrl = args.fileUrl;
    if (args.storageId) {
      const storageUrl = await ctx.storage.getUrl(args.storageId);
      fileUrl = storageUrl ?? fileUrl;
    }

    if (!fileUrl) {
      throw new Error("A file URL or storage ID is required");
    }

    const now = Date.now();
    const documentId = await ctx.db.insert("documents", {
      projectId: args.projectId,
      fileUrl,
      storageId: args.storageId,
      title: args.title,
      status: "uploaded",
      createdAt: now,
      updatedAt: now,
    });

    if (args.storageId) {
      await ctx.scheduler.runAfter(0, internal.ocr.processDocument, {
        documentId,
        storageId: args.storageId,
      });
    }

    return documentId;
  },
});

export const updateStatus = internalMutation({
  args: {
    id: v.id("documents"),
    status: v.union(
      v.literal("uploaded"),
      v.literal("ocr_processing"),
      v.literal("ocr_complete"),
      v.literal("translating"),
      v.literal("ready"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
    pageCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuthorizedDocument(ctx, args.id);
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const { document } = await requireAuthorizedDocument(ctx, args.id);
    if (document.storageId) {
      await ctx.storage.delete(document.storageId);
    }
    await ctx.db.delete(args.id);
  },
});

export const reOCRPage = mutation({
  args: {
    documentId: v.id("documents"),
    pageNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const { document } = await requireAuthorizedDocument(ctx, args.documentId);
    if (!document.storageId) {
      throw new Error("Document has no stored file to re-run OCR.");
    }
    if (args.pageNumber < 1) {
      throw new Error("Page number must be at least 1.");
    }
    await ctx.scheduler.runAfter(0, internal.ocr.processSinglePage, {
      documentId: args.documentId,
      storageId: document.storageId,
      pageNumber: args.pageNumber,
    });
  },
});

export const translateDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await requireAuthorizedDocument(ctx, args.documentId);
    await ctx.scheduler.runAfter(0, internal.translate.translateDocument, {
      documentId: args.documentId,
    });
  },
});

export const translatePage = mutation({
  args: {
    documentId: v.id("documents"),
    pageNumber: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAuthorizedDocument(ctx, args.documentId);
    await ctx.scheduler.runAfter(0, internal.translate.translatePage, {
      documentId: args.documentId,
      pageNumber: args.pageNumber,
    });
  },
});

/**
 * Processes documents that should have OCR or translation running but don't.
 * Called by cron to ensure OCR and translation trigger automatically even if
 * the initial scheduler fails.
 */
export const processPendingDocuments = internalMutation({
  args: {},
  handler: async (ctx) => {
    const documents = await ctx.db.query("documents").collect();

    for (const doc of documents) {
      if (doc.status === "uploaded" && doc.storageId) {
        await ctx.scheduler.runAfter(0, internal.ocr.processDocument, {
          documentId: doc._id,
          storageId: doc.storageId,
        });
      } else if (doc.status === "ocr_complete") {
        const segments = await ctx.db
          .query("segments")
          .withIndex("by_documentId", (q) => q.eq("documentId", doc._id))
          .first();
        if (segments) {
          await ctx.scheduler.runAfter(0, internal.translate.translateDocument, {
            documentId: doc._id,
          });
        }
      }
    }
  },
});
