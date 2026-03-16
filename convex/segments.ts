import { internalMutation, mutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthorizedDocument, requireAuthorizedSegment } from "./lib/auth";
import { assertMaxLength, MAX_SEGMENT_TEXT_LENGTH } from "./lib/limits";

export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const authorized = await getAuthorizedDocument(ctx, args.documentId);
    if (!authorized) {
      return [];
    }

    return await ctx.db
      .query("segments")
      .withIndex("by_documentId_pageNumber_orderIndex", (q) => q.eq("documentId", args.documentId))
      .order("asc")
      .collect();
  },
});

export const listByPage = query({
  args: {
    documentId: v.id("documents"),
    pageNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const authorized = await getAuthorizedDocument(ctx, args.documentId);
    if (!authorized) {
      return [];
    }

    return await ctx.db
      .query("segments")
      .withIndex("by_documentId_pageNumber_orderIndex", (q) =>
        q.eq("documentId", args.documentId).eq("pageNumber", args.pageNumber)
      )
      .order("asc")
      .collect();
  },
});

export const listByDocumentInternal = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("segments")
      .withIndex("by_documentId_pageNumber_orderIndex", (q) => q.eq("documentId", args.documentId))
      .order("asc")
      .collect();
  },
});

export const listByPageInternal = internalQuery({
  args: {
    documentId: v.id("documents"),
    pageNumber: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("segments")
      .withIndex("by_documentId_pageNumber_orderIndex", (q) =>
        q.eq("documentId", args.documentId).eq("pageNumber", args.pageNumber)
      )
      .order("asc")
      .collect();
  },
});

export const create = internalMutation({
  args: {
    documentId: v.id("documents"),
    pageNumber: v.number(),
    text: v.string(),
    bbox: v.object({
      x: v.number(),
      y: v.number(),
      w: v.number(),
      h: v.number(),
    }),
    orderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    assertMaxLength("Segment text", args.text, MAX_SEGMENT_TEXT_LENGTH);
    return await ctx.db.insert("segments", args);
  },
});

export const update = mutation({
  args: {
    segmentId: v.id("segments"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuthorizedSegment(ctx, args.segmentId);
    const trimmedText = args.text.trim();
    assertMaxLength("Segment text", trimmedText, MAX_SEGMENT_TEXT_LENGTH);
    await ctx.db.patch(args.segmentId, { text: trimmedText });
  },
});

export const batchCreate = internalMutation({
  args: {
    segments: v.array(v.object({
      documentId: v.id("documents"),
      pageNumber: v.number(),
      text: v.string(),
      bbox: v.object({
        x: v.number(),
        y: v.number(),
        w: v.number(),
        h: v.number(),
      }),
      orderIndex: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const segment of args.segments) {
      assertMaxLength("Segment text", segment.text, MAX_SEGMENT_TEXT_LENGTH);
      await ctx.db.insert("segments", segment);
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
      await ctx.db.delete(segment._id);
    }
  },
});

export const clearByPage = internalMutation({
  args: {
    documentId: v.id("documents"),
    pageNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const segments = await ctx.db
      .query("segments")
      .withIndex("by_documentId_pageNumber_orderIndex", (q) =>
        q.eq("documentId", args.documentId).eq("pageNumber", args.pageNumber)
      )
      .collect();

    for (const segment of segments) {
      const translation = await ctx.db
        .query("translations")
        .withIndex("by_segmentId", (q) => q.eq("segmentId", segment._id))
        .unique();
      if (translation) {
        await ctx.db.delete(translation._id);
      }
      await ctx.db.delete(segment._id);
    }
  },
});
