"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Languages,
  Save,
  Scan,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useConvexAvailable } from "@/lib/providers";
import type { Segment, Translation } from "@/lib/types";

const PdfViewer = dynamic(
  () => import("@/components/workspace/PdfViewer").then((mod) => mod.PdfViewer),
  { ssr: false }
);

type TranslationEntry = {
  segmentId: string;
  translation: Translation | null;
};

function buildPageNumbers(segments: Segment[]) {
  return Array.from(new Set(segments.map((segment) => segment.pageNumber))).sort((left, right) => left - right);
}

function getStatusLabel(translation: Translation | null | undefined, draft: string) {
  if (translation?.editedByUser) {
    return "Edited";
  }
  if (draft.trim().length === 0) {
    return "Empty";
  }
  return "AI Draft";
}

function WorkspaceUnavailable() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href={`/project/${projectId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-heading text-lg font-semibold text-primary">
                Turathl<span className="text-accent">y</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-dashed border-border bg-card/70 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <h1 className="mt-4 font-heading text-xl font-semibold">Workspace Requires Convex</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This route uses live document, segment, and translation queries and only renders when the Convex client is available.
          </p>
        </div>
      </div>
    </div>
  );
}

function WorkspaceLive() {
  const params = useParams();
  const projectId = params.id as string;
  const documentId = params.documentId as string;
  const document = useQuery(api.documents.getById, { id: documentId }) as
    | import("@/lib/types").Document
    | null
    | undefined;
  const segments = useQuery(api.segments.listByDocument, { documentId }) as Segment[] | undefined;
  const translations = useQuery(api.translations.listByDocument, { documentId }) as
    | TranslationEntry[]
    | undefined;
  const saveTranslation = useMutation(api.translations.upsert);
  const updateSegment = useMutation(api.segments.update);
  const exportDocument = useAction(api.export.exportDocument);
  const removeDocument = useMutation(api.documents.remove);
  const reOCRPage = useMutation(api.documents.reOCRPage);
  const translateDocument = useMutation(api.documents.translateDocument);
  const translatePage = useMutation(api.documents.translatePage);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [editingTranslations, setEditingTranslations] = useState<Record<string, string>>({});
  const [editingSourceText, setEditingSourceText] = useState<Record<string, string>>({});
  const [savingSegments, setSavingSegments] = useState<Set<string>>(new Set());
  const [savedSegments, setSavedSegments] = useState<Set<string>>(new Set());
  const [failedSegments, setFailedSegments] = useState<Record<string, string>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReocrPage, setIsReocrPage] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatingPage, setIsTranslatingPage] = useState(false);
  const [savingSourceSegments, setSavingSourceSegments] = useState<Set<string>>(new Set());
  const [savedSourceSegments, setSavedSourceSegments] = useState<Set<string>>(new Set());
  const [failedSourceSegments, setFailedSourceSegments] = useState<Record<string, string>>({});

  const dirtySegmentsRef = useRef<Set<string>>(new Set());
  const dirtySourceRef = useRef<Set<string>>(new Set());
  const sourceSaveTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const saveTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const pageSectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const editorPageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const sourceSegmentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const editorRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const sourceColumnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      Object.values(saveTimeoutRef.current).forEach(clearTimeout);
      Object.values(sourceSaveTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!segments || segments.length === 0) {
      return;
    }

    setSelectedSegmentId((current) => current ?? segments[0]._id);
  }, [segments]);

  useEffect(() => {
    if (!segments || !translations) {
      return;
    }

    setEditingTranslations((current) => {
      const next = { ...current };

      for (const segment of segments) {
        if (dirtySegmentsRef.current.has(segment._id)) {
          continue;
        }

        const translation = translations.find((entry) => entry.segmentId === segment._id)?.translation;
        next[segment._id] = translation?.translation ?? "";
      }

      return next;
    });

    setEditingSourceText((current) => {
      const next = { ...current };

      for (const segment of segments) {
        if (dirtySourceRef.current.has(segment._id)) {
          continue;
        }

        next[segment._id] = segment.text;
      }

      return next;
    });
  }, [segments, translations]);

  const allSegments = segments ?? [];
  const allTranslations = translations ?? [];
  const pageNumbers = buildPageNumbers(allSegments);
  const selectedSegment = allSegments.find((segment) => segment._id === selectedSegmentId) ?? null;
  const translationMap = new Map(
    allTranslations.map((entry: TranslationEntry) => [entry.segmentId, entry.translation])
  );

  useEffect(() => {
    const maxPage = document?.pageCount ?? (pageNumbers.length > 0 ? Math.max(...pageNumbers) : 1);
    setCurrentPage((prev) => {
      if (prev < 1) return 1;
      if (prev > maxPage) return maxPage;
      return prev;
    });
  }, [document?.pageCount, pageNumbers]);

  useEffect(() => {
    const sourceColumn = sourceColumnRef.current;
    if (!sourceColumn || pageNumbers.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const nextPage = Number((visibleEntry.target as HTMLElement).dataset.pageNumber);
        if (Number.isFinite(nextPage)) {
          setCurrentPage(nextPage);
        }
      },
      {
        root: sourceColumn,
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0.2, 0.45, 0.7],
      }
    );

    for (const pageNumber of pageNumbers) {
      const node = pageSectionRefs.current[pageNumber];
      if (node) {
        observer.observe(node);
      }
    }

    return () => observer.disconnect();
  }, [pageNumbers]);

  const scrollToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    pageSectionRefs.current[pageNumber]?.scrollIntoView({ behavior: "smooth", block: "start" });
    editorPageRefs.current[pageNumber]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const focusSegment = (segment: Segment) => {
    setSelectedSegmentId(segment._id);
    setCurrentPage(segment.pageNumber);

    sourceSegmentRefs.current[segment._id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    editorRefs.current[segment._id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const queueSave = (segmentId: string, value: string) => {
    if (saveTimeoutRef.current[segmentId]) {
      clearTimeout(saveTimeoutRef.current[segmentId]);
    }

    saveTimeoutRef.current[segmentId] = setTimeout(async () => {
      setSavingSegments((current) => new Set(current).add(segmentId));
      setFailedSegments((current) => {
        const next = { ...current };
        delete next[segmentId];
        return next;
      });

      try {
        await saveTranslation({
          segmentId,
          translation: value,
          aiGenerated: false,
          editedByUser: true,
        });

        dirtySegmentsRef.current.delete(segmentId);
        setSavedSegments((current) => new Set(current).add(segmentId));
      } catch (error) {
        setFailedSegments((current) => ({
          ...current,
          [segmentId]: error instanceof Error ? error.message : "Save failed",
        }));
      } finally {
        setSavingSegments((current) => {
          const next = new Set(current);
          next.delete(segmentId);
          return next;
        });
      }
    }, 500);
  };

  const queueSaveSource = (segmentId: string, value: string) => {
    if (sourceSaveTimeoutRef.current[segmentId]) {
      clearTimeout(sourceSaveTimeoutRef.current[segmentId]);
    }

    sourceSaveTimeoutRef.current[segmentId] = setTimeout(async () => {
      setSavingSourceSegments((current) => new Set(current).add(segmentId));
      setFailedSourceSegments((current) => {
        const next = { ...current };
        delete next[segmentId];
        return next;
      });

      try {
        await updateSegment({ segmentId, text: value });
        dirtySourceRef.current.delete(segmentId);
        setSavedSourceSegments((current) => new Set(current).add(segmentId));
      } catch (error) {
        setFailedSourceSegments((current) => ({
          ...current,
          [segmentId]: error instanceof Error ? error.message : "Save failed",
        }));
      } finally {
        setSavingSourceSegments((current) => {
          const next = new Set(current);
          next.delete(segmentId);
          return next;
        });
      }
    }, 500);
  };

  const handleSourceChange = (segmentId: string, value: string) => {
    dirtySourceRef.current.add(segmentId);
    setEditingSourceText((current) => ({ ...current, [segmentId]: value }));
    setSavedSourceSegments((current) => {
      const next = new Set(current);
      next.delete(segmentId);
      return next;
    });
  };

  const handleTranslationChange = (segmentId: string, value: string) => {
    dirtySegmentsRef.current.add(segmentId);
    setEditingTranslations((current) => ({ ...current, [segmentId]: value }));
    setSavedSegments((current) => {
      const next = new Set(current);
      next.delete(segmentId);
      return next;
    });
  };

  const handleTranslateDocument = async () => {
    // Flush any pending source saves
    for (const segmentId of Array.from(dirtySourceRef.current)) {
      if (sourceSaveTimeoutRef.current[segmentId]) {
        clearTimeout(sourceSaveTimeoutRef.current[segmentId]);
        delete sourceSaveTimeoutRef.current[segmentId];
      }
      const text = editingSourceText[segmentId];
      if (text !== undefined) {
        await updateSegment({ segmentId, text });
        dirtySourceRef.current.delete(segmentId);
      }
    }

    setIsTranslating(true);
    try {
      await translateDocument({ documentId });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslatePage = async () => {
    // Flush any pending source saves for the current page
    const pageSegments = allSegments.filter((s) => s.pageNumber === currentPage);
    for (const segment of pageSegments) {
      if (dirtySourceRef.current.has(segment._id)) {
        if (sourceSaveTimeoutRef.current[segment._id]) {
          clearTimeout(sourceSaveTimeoutRef.current[segment._id]);
          delete sourceSaveTimeoutRef.current[segment._id];
        }
        const text = editingSourceText[segment._id];
        if (text !== undefined) {
          await updateSegment({ segmentId: segment._id, text });
          dirtySourceRef.current.delete(segment._id);
        }
      }
    }

    setIsTranslatingPage(true);
    try {
      await translatePage({ documentId, pageNumber: currentPage });
    } finally {
      setIsTranslatingPage(false);
    }
  };

  const handleReOCRPage = async () => {
    setIsReocrPage(true);
    try {
      await reOCRPage({ documentId, pageNumber: currentPage });
    } finally {
      setIsReocrPage(false);
    }
  };

  const handleDeleteDocument = async () => {
    setIsDeleting(true);
    try {
      await removeDocument({ id: documentId });
      router.push(`/project/${projectId}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const result = (await exportDocument({ documentId })) as {
        url: string;
        fileName: string;
      };
      const link = window.document.createElement("a");
      link.href = result.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = result.fileName;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  const handleEditorKeyDown = (segmentId: string, event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    const currentIndex = allSegments.findIndex((segment) => segment._id === segmentId);
    const nextSegment = allSegments[currentIndex + 1];
    if (!nextSegment) {
      return;
    }

    focusSegment(nextSegment);
    window.requestAnimationFrame(() => {
      editorRefs.current[nextSegment._id]?.focus();
    });
  };

  if (document === undefined || segments === undefined || translations === undefined) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md rounded-2xl border border-dashed border-border bg-card/70 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <h1 className="mt-4 font-heading text-xl font-semibold">Document Not Found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This document is unavailable or does not belong to the current account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="shrink-0 border-b border-border bg-card">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href={`/project/${projectId}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-heading text-lg font-semibold text-primary">
                  Turathl<span className="text-accent">y</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollToPage(Math.max(pageNumbers[0] ?? 1, currentPage - 1))}
                  disabled={pageNumbers.length === 0 || currentPage <= (pageNumbers[0] ?? 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-28 text-center text-sm text-muted-foreground">
                  Page {currentPage} of {pageNumbers.at(-1) ?? 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollToPage(Math.min(pageNumbers.at(-1) ?? currentPage, currentPage + 1))}
                  disabled={pageNumbers.length === 0 || currentPage >= (pageNumbers.at(-1) ?? currentPage)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={() => void handleExport()} disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export DOCX
              </Button>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <h1 className="font-heading text-lg font-semibold">{document.title || "Untitled Document"}</h1>
            <Badge variant="secondary" className="capitalize">
              {document.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>
      </header>

      {(document.status === "error" || pdfLoadError) && (
        <div className="mx-6 mb-4 flex items-center justify-between gap-4 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">
            {document.status === "error"
              ? document.errorMessage ?? "This document failed to process."
              : "The PDF could not be loaded."}
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => void handleDeleteDocument()}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete PDF
          </Button>
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[1.05fr_0.95fr_1fr]">
        <div className="min-h-0 border-b border-border xl:border-r xl:border-b-0">
          <PdfViewer
            fileUrl={
              document.fileUrl && document.fileUrl.includes("convex.cloud") && document.fileUrl.includes("/api/storage")
                ? `/api/pdf?url=${encodeURIComponent(document.fileUrl)}`
                : document.fileUrl
            }
            pageNumber={currentPage}
            selectedSegment={selectedSegment}
            onLoadError={() => setPdfLoadError(true)}
            onDelete={() => void handleDeleteDocument()}
            onPageChange={scrollToPage}
          />
        </div>

        <div ref={sourceColumnRef} className="min-h-0 overflow-y-auto border-b border-border bg-card xl:border-r xl:border-b-0">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-card/95 px-5 py-3 backdrop-blur-sm">
            <h2 className="text-sm font-medium text-muted-foreground">Arabic Source</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleReOCRPage()}
              disabled={
                isReocrPage ||
                !document.storageId ||
                document.status === "ocr_processing" ||
                document.status === "translating"
              }
              title={`Re-run OCR on page ${currentPage}`}
            >
              {isReocrPage ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Scan className="mr-1.5 h-3.5 w-3.5" />
              )}
              OCR Page {currentPage}
            </Button>
          </div>

          <div className="space-y-8 p-5">
            {pageNumbers.map((pageNumber) => {
              const pageSegments = allSegments.filter((segment) => segment.pageNumber === pageNumber);

              return (
                <div
                  key={pageNumber}
                  ref={(node) => {
                    pageSectionRefs.current[pageNumber] = node;
                  }}
                  data-page-number={pageNumber}
                  className="space-y-3"
                >
                  <div className="sticky top-14 z-[1] -mx-1 rounded-lg bg-background/90 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm">
                    Page {pageNumber}
                  </div>

                  {pageSegments.map((segment) => {
                    const translation = translationMap.get(segment._id);
                    const draft = editingTranslations[segment._id] ?? "";
                    const sourceText = editingSourceText[segment._id] ?? segment.text;
                    const isSelected = selectedSegmentId === segment._id;
                    const isSavingSource = savingSourceSegments.has(segment._id);
                    const isSavedSource = savedSourceSegments.has(segment._id);
                    const sourceError = failedSourceSegments[segment._id];

                    return (
                      <div
                        key={segment._id}
                        ref={(node) => {
                          sourceSegmentRefs.current[segment._id] = node;
                        }}
                        className={`block w-full transition-transform ${isSelected ? "translate-x-1" : ""}`}
                      >
                        <Card
                          className={`gap-3 border px-4 py-4 ${
                            isSelected
                              ? "border-accent bg-[rgba(232,93,117,0.08)] shadow-[0_10px_24px_rgba(232,93,117,0.12)]"
                              : "border-transparent hover:border-primary/20"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <Badge variant="outline" className="text-[0.7rem] uppercase tracking-[0.14em]">
                              {getStatusLabel(translation, draft)}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Segment {segment.orderIndex + 1}</span>
                              {isSavingSource && (
                                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                              )}
                              {isSavedSource && !isSavingSource && !sourceError && (
                                <Check className="h-3 w-3 text-emerald-600" />
                              )}
                            </div>
                          </div>
                          <Textarea
                            dir="rtl"
                            value={sourceText}
                            onChange={(e) => handleSourceChange(segment._id, e.target.value)}
                            onBlur={() => queueSaveSource(segment._id, sourceText)}
                            onFocus={() => focusSegment(segment)}
                            className="font-arabic min-h-20 resize-y bg-transparent text-lg leading-loose text-right"
                            placeholder="Arabic source text…"
                          />
                          {sourceError && <p className="mt-1 text-xs text-destructive">{sourceError}</p>}
                        </Card>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto bg-background">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-5 py-3 backdrop-blur-sm">
            <h2 className="text-sm font-medium text-muted-foreground">Translation Editor</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleTranslatePage()}
                disabled={
                  isTranslatingPage ||
                  isTranslating ||
                  allSegments.length === 0 ||
                  document.status === "ocr_processing" ||
                  document.status === "translating"
                }
                title={`Translate segments on page ${currentPage}`}
              >
                {isTranslatingPage ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Languages className="mr-1.5 h-3.5 w-3.5" />
                )}
                Translate Page {currentPage}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleTranslateDocument()}
                disabled={
                  isTranslating ||
                  isTranslatingPage ||
                  allSegments.length === 0 ||
                  document.status === "ocr_processing" ||
                  document.status === "translating"
                }
                title="Translate all segments in the document"
              >
                {isTranslating ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Languages className="mr-1.5 h-3.5 w-3.5" />
                )}
                Translate All
              </Button>
            </div>
          </div>

          <div className="space-y-8 p-5">
            {pageNumbers.map((pageNumber) => {
              const pageSegments = allSegments.filter((segment) => segment.pageNumber === pageNumber);

              return (
                <div
                  key={pageNumber}
                  ref={(node) => {
                    editorPageRefs.current[pageNumber] = node;
                  }}
                  className="space-y-4"
                >
                  <div className="sticky top-14 z-[1] -mx-1 rounded-lg bg-background/90 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm">
                    Page {pageNumber}
                  </div>

                  {pageSegments.map((segment) => {
                    const draft = editingTranslations[segment._id] ?? "";
                    const translation = translationMap.get(segment._id);
                    const isSaving = savingSegments.has(segment._id);
                    const isSaved = savedSegments.has(segment._id);
                    const isSelected = selectedSegmentId === segment._id;
                    const saveError = failedSegments[segment._id];

                    return (
                      <div
                        key={segment._id}
                        className={`rounded-2xl border px-4 py-4 shadow-sm transition-colors ${
                          isSelected ? "border-accent bg-card" : "border-border bg-card/80"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Segment {segment.orderIndex + 1}</Badge>
                            <Badge
                              variant="secondary"
                              className={
                                translation?.editedByUser
                                  ? "bg-emerald-100 text-emerald-700"
                                  : draft.trim()
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-muted text-muted-foreground"
                              }
                            >
                              {getStatusLabel(translation, draft)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {isSaving && (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Saving…
                              </>
                            )}
                            {isSaved && !isSaving && !saveError && (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" />
                                Saved
                              </>
                            )}
                            {saveError && (
                              <>
                                <AlertCircle className="h-3 w-3 text-destructive" />
                                Failed
                              </>
                            )}
                            {!isSaving && !isSaved && !saveError && (
                              <>
                                <Save className="h-3 w-3" />
                                Draft
                              </>
                            )}
                          </div>
                        </div>

                        <Textarea
                          ref={(node) => {
                            editorRefs.current[segment._id] = node;
                          }}
                          value={draft}
                          placeholder="Enter translation…"
                          className="min-h-36 resize-y bg-background"
                          onFocus={() => setSelectedSegmentId(segment._id)}
                          onChange={(event) => handleTranslationChange(segment._id, event.target.value)}
                          onBlur={() => queueSave(segment._id, draft)}
                          onKeyDown={(event) => handleEditorKeyDown(segment._id, event)}
                        />

                        {saveError && <p className="mt-2 text-sm text-destructive">{saveError}</p>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TranslatePage() {
  const convexAvailable = useConvexAvailable();
  return convexAvailable ? <WorkspaceLive /> : <WorkspaceUnavailable />;
}
