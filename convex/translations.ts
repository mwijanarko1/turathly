import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthorizedDocument, getAuthorizedSegment, requireAuthorizedSegment } from "./lib/auth";
import { assertMaxLength, MAX_TRANSLATION_LENGTH } from "./lib/limits";

export const getBySegment = query({
  args: { segmentId: v.id("segments") },
  handler: async (ctx, args) => {
    const authorized = await getAuthorizedSegment(ctx, args.segmentId);
    if (!authorized) {
      return null;
    }

    return await ctx.db
      .query("translations")
      .withIndex("by_segmentId", (q) => q.eq("segmentId", args.segmentId))
      .unique();
  },
});

export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const authorized = await getAuthorizedDocument(ctx, args.documentId);
    if (!authorized) {
      return [];
    }

    const segments = await ctx.db
      .query("segments")
      .withIndex("by_documentId_pageNumber_orderIndex", (q) => q.eq("documentId", args.documentId))
      .order("asc")
      .collect();

    const translations = await Promise.all(
      segments.map(async (segment) => {
        const translation = await ctx.db
          .query("translations")
          .withIndex("by_segmentId", (q) => q.eq("segmentId", segment._id))
          .unique();
        return { segmentId: segment._id, translation };
      })
    );

    return translations;
  },
});

export const listByDocumentInternal = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const segments = await ctx.db
      .query("segments")
      .withIndex("by_documentId_pageNumber_orderIndex", (q) => q.eq("documentId", args.documentId))
      .order("asc")
      .collect();

    return await Promise.all(
      segments.map(async (segment) => {
        const translation = await ctx.db
          .query("translations")
          .withIndex("by_segmentId", (q) => q.eq("segmentId", segment._id))
          .unique();
        return { segmentId: segment._id, translation };
      })
    );
  },
});

export const upsert = mutation({
  args: {
    segmentId: v.id("segments"),
    translation: v.string(),
    aiGenerated: v.boolean(),
    editedByUser: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAuthorizedSegment(ctx, args.segmentId);
    assertMaxLength("Translation", args.translation, MAX_TRANSLATION_LENGTH);
    const existing = await ctx.db
      .query("translations")
      .withIndex("by_segmentId", (q) => q.eq("segmentId", args.segmentId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        translation: args.translation,
        aiGenerated: args.aiGenerated,
        editedByUser: args.editedByUser,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("translations", {
      segmentId: args.segmentId,
      translation: args.translation,
      aiGenerated: args.aiGenerated,
      editedByUser: args.editedByUser,
      updatedAt: Date.now(),
    });
  },
});

export const createBatch = internalMutation({
  args: {
    translations: v.array(v.object({
      segmentId: v.id("segments"),
      translation: v.string(),
      aiGenerated: v.boolean(),
      editedByUser: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    for (const t of args.translations) {
      assertMaxLength("Translation", t.translation, MAX_TRANSLATION_LENGTH);
      const existing = await ctx.db
        .query("translations")
        .withIndex("by_segmentId", (q) => q.eq("segmentId", t.segmentId))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          translation: t.translation,
          aiGenerated: t.aiGenerated,
          editedByUser: t.editedByUser,
          updatedAt: Date.now(),
        });
        continue;
      }

      await ctx.db.insert("translations", {
        ...t,
        updatedAt: Date.now(),
      });
    }
  },
});

export const clearByDocument = internalMutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const segments = await ctx.db
      .query("segments")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const segment of segments) {
      const translation = await ctx.db
        .query("translations")
        .withIndex("by_segmentId", (q) => q.eq("segmentId", segment._id))
        .unique();

      if (translation) {
        await ctx.db.delete(translation._id);
      }
    }
  },
});
