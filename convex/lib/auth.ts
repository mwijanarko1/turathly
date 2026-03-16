import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type DbCtx = Pick<QueryCtx, "auth" | "db"> | Pick<MutationCtx, "auth" | "db">;

export async function getConvexUserFromClerkId(
  ctx: Pick<QueryCtx, "db">,
  clerkId: string
): Promise<Doc<"users"> | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .first();
}

export async function getCurrentConvexUser(ctx: DbCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  return await getConvexUserFromClerkId(ctx, identity.subject);
}

export async function requireCurrentConvexUser(ctx: DbCtx): Promise<Doc<"users">> {
  const user = await getCurrentConvexUser(ctx);
  if (!user) {
    throw new Error("Not authenticated");
  }

  return user;
}

export async function getOrCreateConvexUser(
  ctx: Pick<MutationCtx, "db">,
  identity: {
    subject: string;
    name?: string | null;
    email?: string | null;
  }
): Promise<Doc<"users">> {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (existing) {
    return existing;
  }

  const userId = await ctx.db.insert("users", {
    clerkId: identity.subject,
    name: identity.name ?? undefined,
    email: identity.email ?? "",
    createdAt: Date.now(),
  });

  return {
    _id: userId,
    clerkId: identity.subject,
    name: identity.name ?? undefined,
    email: identity.email ?? "",
    createdAt: Date.now(),
    _creationTime: Date.now(),
  };
}

export async function getAuthorizedProject(
  ctx: DbCtx,
  projectId: Id<"projects">
): Promise<{ user: Doc<"users">; project: Doc<"projects"> } | null> {
  const user = await getCurrentConvexUser(ctx);
  if (!user) {
    return null;
  }

  const project = await ctx.db.get(projectId);
  if (!project || project.ownerId !== user._id) {
    return null;
  }

  return { user, project };
}

export async function requireAuthorizedProject(
  ctx: DbCtx,
  projectId: Id<"projects">
): Promise<{ user: Doc<"users">; project: Doc<"projects"> }> {
  const result = await getAuthorizedProject(ctx, projectId);
  if (!result) {
    throw new Error("Project not found");
  }

  return result;
}

export async function getAuthorizedDocument(
  ctx: DbCtx,
  documentId: Id<"documents">
): Promise<{ user: Doc<"users">; project: Doc<"projects">; document: Doc<"documents"> } | null> {
  const user = await getCurrentConvexUser(ctx);
  if (!user) {
    return null;
  }

  const document = await ctx.db.get(documentId);
  if (!document) {
    return null;
  }

  const project = await ctx.db.get(document.projectId);
  if (!project || project.ownerId !== user._id) {
    return null;
  }

  return { user, project, document };
}

export async function requireAuthorizedDocument(
  ctx: DbCtx,
  documentId: Id<"documents">
): Promise<{ user: Doc<"users">; project: Doc<"projects">; document: Doc<"documents"> }> {
  const result = await getAuthorizedDocument(ctx, documentId);
  if (!result) {
    throw new Error("Document not found");
  }

  return result;
}

export async function getAuthorizedSegment(
  ctx: DbCtx,
  segmentId: Id<"segments">
): Promise<{
  user: Doc<"users">;
  project: Doc<"projects">;
  document: Doc<"documents">;
  segment: Doc<"segments">;
} | null> {
  const user = await getCurrentConvexUser(ctx);
  if (!user) {
    return null;
  }

  const segment = await ctx.db.get(segmentId);
  if (!segment) {
    return null;
  }

  const document = await ctx.db.get(segment.documentId);
  if (!document) {
    return null;
  }

  const project = await ctx.db.get(document.projectId);
  if (!project || project.ownerId !== user._id) {
    return null;
  }

  return { user, project, document, segment };
}

export async function requireAuthorizedSegment(
  ctx: DbCtx,
  segmentId: Id<"segments">
): Promise<{
  user: Doc<"users">;
  project: Doc<"projects">;
  document: Doc<"documents">;
  segment: Doc<"segments">;
}> {
  const result = await getAuthorizedSegment(ctx, segmentId);
  if (!result) {
    throw new Error("Segment not found");
  }

  return result;
}
