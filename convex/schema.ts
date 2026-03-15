import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  projects: defineTable({
    ownerId: v.id("users"),
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_ownerId", ["ownerId"]),

  documents: defineTable({
    projectId: v.id("projects"),
    fileUrl: v.string(),
    storageId: v.optional(v.id("_storage")),
    title: v.optional(v.string()),
    pageCount: v.optional(v.number()),
    status: v.union(
      v.literal("uploaded"),
      v.literal("ocr_processing"),
      v.literal("ocr_complete"),
      v.literal("translating"),
      v.literal("ready"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_projectId", ["projectId"]),

  pages: defineTable({
    documentId: v.id("documents"),
    pageNumber: v.number(),
    imageUrl: v.string(),
    storageId: v.optional(v.id("_storage")),
  }).index("by_documentId", ["documentId"]),

  segments: defineTable({
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
  }).index("by_documentId_pageNumber_orderIndex", ["documentId", "pageNumber", "orderIndex"])
    .index("by_documentId", ["documentId"]),

  translations: defineTable({
    segmentId: v.id("segments"),
    translation: v.string(),
    aiGenerated: v.boolean(),
    editedByUser: v.boolean(),
    updatedAt: v.number(),
  }).index("by_segmentId", ["segmentId"]),
});