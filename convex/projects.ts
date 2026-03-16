import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  getOrCreateConvexUser,
  getAuthorizedProject,
  requireAuthorizedProject,
  requireCurrentConvexUser,
} from "./lib/auth";
import { assertMaxLength, MAX_TITLE_LENGTH } from "./lib/limits";

export const listByOwner = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentConvexUser(ctx).catch(() => null);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("projects")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const result = await getAuthorizedProject(ctx, args.id);
    return result?.project ?? null;
  },
});

export const getInternal = internalQuery({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    sourceLang: v.string(),
    targetLang: v.string(),
    genre: v.optional(v.union(
      v.literal("general"),
      v.literal("tafsir"),
      v.literal("fiqh"),
      v.literal("hadith"),
      v.literal("theology"),
      v.literal("biography")
    )),
  },
  handler: async (ctx, args) => {
    assertMaxLength("Project title", args.title, MAX_TITLE_LENGTH);
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await getOrCreateConvexUser(ctx, {
      subject: identity.subject,
      name: identity.name,
      email: identity.email,
    });

    const now = Date.now();
    return await ctx.db.insert("projects", {
      ownerId: user._id,
      title: args.title,
      sourceLang: args.sourceLang,
      targetLang: args.targetLang,
      genre: args.genre,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    sourceLang: v.optional(v.string()),
    targetLang: v.optional(v.string()),
    genre: v.optional(v.union(
      v.literal("general"),
      v.literal("tafsir"),
      v.literal("fiqh"),
      v.literal("hadith"),
      v.literal("theology"),
      v.literal("biography")
    )),
  },
  handler: async (ctx, args) => {
    await requireAuthorizedProject(ctx, args.id);
    assertMaxLength("Project title", args.title, MAX_TITLE_LENGTH);
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuthorizedProject(ctx, args.id);
    await ctx.db.delete(args.id);
  },
});
