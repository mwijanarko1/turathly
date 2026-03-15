import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("segments")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .order("asc");
  },
});

export const listByPage = query({
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
      .order("asc");
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
    return await ctx.db.insert("segments", args);
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
      await ctx.db.insert("segments", segment);
    }
  },
});