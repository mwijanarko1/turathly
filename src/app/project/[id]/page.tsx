"use client";

import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Scan,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { api } from "@/convex/_generated/api";
import { useConvexAvailable } from "@/lib/providers";
import type { Document, Project } from "@/lib/types";

export const dynamic = "force-dynamic";

const statusConfig: Record<
  Document["status"],
  {
    label: string;
    icon: typeof FileText;
    badgeClassName: string;
  }
> = {
  uploaded: {
    label: "Uploaded",
    icon: FileText,
    badgeClassName: "bg-secondary text-secondary-foreground",
  },
  ocr_processing: {
    label: "Processing OCR",
    icon: Loader2,
    badgeClassName: "bg-primary text-primary-foreground",
  },
  ocr_complete: {
    label: "OCR Complete",
    icon: CheckCircle,
    badgeClassName: "bg-secondary text-secondary-foreground",
  },
  translating: {
    label: "Translating",
    icon: Loader2,
    badgeClassName: "bg-primary text-primary-foreground",
  },
  ready: {
    label: "Ready",
    icon: CheckCircle,
    badgeClassName: "bg-emerald-100 text-emerald-700",
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    badgeClassName: "bg-destructive/15 text-destructive",
  },
};

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

function ProjectShell({
  children,
  convexAvailable,
}: {
  children: React.ReactNode;
  convexAvailable: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl font-semibold text-primary">
                Turathl<span className="text-accent">y</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {!convexAvailable && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            <p className="text-sm">
              Convex is not configured. Add `NEXT_PUBLIC_CONVEX_URL` to enable
              uploads and live document status.
            </p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

function ProjectUnavailable() {
  return (
    <ProjectShell convexAvailable={false}>
      <div className="rounded-2xl border border-dashed border-border bg-card/70 px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-heading text-xl font-semibold">
          Project Data Requires Convex
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This route switches to live project and document queries when the
          Convex client is available.
        </p>
      </div>
    </ProjectShell>
  );
}

function ProjectLive() {
  const params = useParams();
  const projectId = params.id as string;
  const project = useQuery(api.projects.getById, { id: projectId }) as
    | Project
    | null
    | undefined;
  const documents = useQuery(api.documents.listByProject, { projectId }) as
    | Document[]
    | undefined;
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const createDocument = useMutation(api.documents.create);
  const removeDocument = useMutation(api.documents.remove);
  const runOCR = useMutation(api.documents.runOCR);
  const [isUploading, setIsUploading] = useState(false);
  const [runningOcrId, setRunningOcrId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setErrorMessage("Only PDF uploads are supported.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const uploadUrl = await generateUploadUrl({});
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload to Convex storage failed");
      }

      const { storageId } = (await uploadResponse.json()) as {
        storageId?: string;
      };
      if (!storageId) {
        throw new Error("Convex storage did not return a storage ID");
      }

      await createDocument({
        projectId,
        storageId,
        title: file.name.replace(/\.pdf$/i, ""),
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunOCR = async (docId: string) => {
    setRunningOcrId(docId);
    try {
      await runOCR({ documentId: docId });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "OCR failed");
    } finally {
      setRunningOcrId(null);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    setDeletingId(docId);
    try {
      await removeDocument({ id: docId });
      setPendingDelete(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProjectShell convexAvailable>
      {project === undefined ? (
        <div className="rounded-2xl border border-border bg-card/70 px-6 py-16 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Loading project…</p>
        </div>
      ) : !project ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/70 px-6 py-16 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <h1 className="mt-4 font-heading text-xl font-semibold">
            Project Not Found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This project is unavailable or does not belong to the current
            account.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="font-heading text-3xl font-bold text-foreground">
                {project.title}
              </h1>
              <Badge variant="secondary" className="capitalize">
                {project.genre || "general"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {project.sourceLang} to {project.targetLang}
            </p>
          </div>

          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold">Documents</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a PDF, then click Run OCR and Translate when ready.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => void handleFileUpload(event)}
                className="hidden"
                disabled={isUploading}
              />
              <label htmlFor="pdf-upload">
                <span className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload PDF
                    </>
                  )}
                </span>
              </label>
            </div>
          </div>

          {errorMessage && (
            <p className="mb-4 text-sm text-destructive" aria-live="polite">
              {errorMessage}
            </p>
          )}

          {documents === undefined ? (
            <div className="rounded-2xl border border-border bg-card/70 px-6 py-16 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Loading documents…
              </p>
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/70 px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                No documents yet
              </h3>
              <p className="mt-2 text-muted-foreground">
                Upload a PDF, then run OCR and translation from each document.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {documents.map((document) => {
                const status = statusConfig[document.status];
                const StatusIcon = status.icon;

                return (
                  <Card
                    key={document._id}
                    className="border-transparent transition-colors hover:border-primary/20"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="line-clamp-2 text-lg">
                          {document.title || "Untitled Document"}
                        </CardTitle>
                        <Badge className={status.badgeClassName}>
                          <StatusIcon
                            className={`mr-1 h-3 w-3 ${
                              document.status === "ocr_processing" ||
                              document.status === "translating"
                                ? "animate-spin"
                                : ""
                            }`}
                          />
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Updated {formatDate(document.updatedAt)}
                      </div>

                      {document.errorMessage && (
                        <p className="rounded-lg bg-destructive/8 px-3 py-2 text-sm text-destructive">
                          {document.errorMessage}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-muted-foreground">
                          {document.pageCount
                            ? `${document.pageCount} pages`
                            : "Page count pending"}
                        </span>
                        <div className="flex items-center gap-2">
                          {(document.status === "uploaded" ||
                            document.status === "error") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => void handleRunOCR(document._id)}
                              disabled={runningOcrId === document._id}
                            >
                              {runningOcrId === document._id ? (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              ) : (
                                <Scan className="mr-1 h-3 w-3" />
                              )}
                              Run OCR
                            </Button>
                          )}
                          {document.status === "error" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                setPendingDelete({
                                  id: document._id,
                                  title: document.title || "Untitled Document",
                                })
                              }
                              disabled={deletingId === document._id}
                            >
                              {deletingId === document._id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="mr-1 h-3 w-3" />
                              )}
                              Delete
                            </Button>
                          )}
                          <Link
                            href={`/project/${projectId}/translate/${document._id}`}
                          >
                            <Button
                              size="sm"
                              variant={
                                document.status === "ready"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {document.status === "ready"
                                ? "Open Workspace"
                                : "View Progress"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        title="Delete document?"
        description={
          pendingDelete
            ? `This will permanently remove “${pendingDelete.title}” and its OCR and translation data.`
            : ""
        }
        confirmLabel="Delete document"
        isConfirming={pendingDelete ? deletingId === pendingDelete.id : false}
        onConfirm={async () => {
          if (!pendingDelete) {
            return;
          }
          await handleDeleteDocument(pendingDelete.id);
        }}
      />
    </ProjectShell>
  );
}

export default function ProjectPage() {
  const convexAvailable = useConvexAvailable();
  return convexAvailable ? <ProjectLive /> : <ProjectUnavailable />;
}
