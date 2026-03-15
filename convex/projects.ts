import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listByOwner = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("projects")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
      .order("desc");
  },
});

export const getById = query({
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

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
    await ctx.db.delete(args.id);
  },
});