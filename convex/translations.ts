import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getBySegment = query({
  args: { segmentId: v.id("segments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("translations")
      .withIndex("by_segmentId", (q) => q.eq("segmentId", args.segmentId))
      .unique();
  },
});

export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const segments = await ctx.db
      .query("segments")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
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

export const upsert = mutation({
  args: {
    segmentId: v.id("segments"),
    translation: v.string(),
    aiGenerated: v.boolean(),
    editedByUser: v.boolean(),
  },
  handler: async (ctx, args) => {
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
      await ctx.db.insert("translations", {
        ...t,
        updatedAt: Date.now(),
      });
    }
  },
});