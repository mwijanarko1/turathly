"use client";

// Polyfill DOMMatrix for SSR environments where react-pdf might be evaluated
if (typeof window === "undefined") {
  // @ts-ignore
  global.DOMMatrix = class DOMMatrix {
    constructor() {}
  };
}

import { ChevronLeft, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { Segment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type PdfViewerProps = {
  fileUrl?: string | null;
  pageNumber: number;
  selectedSegment?: Segment | null;
  onLoadError?: () => void;
  onDelete?: () => void;
  onPageChange?: (page: number) => void;
};

export function PdfViewer({ fileUrl, pageNumber, selectedSegment, onLoadError, onDelete, onPageChange }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const jumpInputRef = useRef<HTMLInputElement | null>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeightRatio, setPageHeightRatio] = useState(1.414);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [jumpValue, setJumpValue] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }
      setPageWidth(entry.contentRect.width);
    });

    observer.observe(container);
    setPageWidth(container.clientWidth);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setHasLoadError(false);
  }, [fileUrl, pageNumber]);

  useEffect(() => {
    setNumPages(null);
  }, [fileUrl]);

  const handleLoadError = () => {
    setIsLoading(false);
    setHasLoadError(true);
    onLoadError?.();
  };

  const handlePrevPage = () => {
    if (onPageChange && pageNumber > 1) {
      onPageChange(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (onPageChange && numPages !== null && pageNumber < numPages) {
      onPageChange(pageNumber + 1);
    }
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpValue, 10);
    if (!Number.isFinite(parsed) || !onPageChange || !numPages) return;
    const clamped = Math.max(1, Math.min(numPages, parsed));
    onPageChange(clamped);
    setJumpValue("");
    jumpInputRef.current?.blur();
  };

  const effectiveWidth = pageWidth > 0 ? Math.max(0, Math.min(pageWidth - 32, 688)) : 0;
  const overlayStyle =
    selectedSegment && effectiveWidth > 0
      ? {
          left: `${selectedSegment.bbox.x * effectiveWidth}px`,
          top: `${selectedSegment.bbox.y * effectiveWidth * pageHeightRatio}px`,
          width: `${selectedSegment.bbox.w * effectiveWidth}px`,
          height: `${selectedSegment.bbox.h * effectiveWidth * pageHeightRatio}px`,
        }
      : null;

  const totalPages = numPages ?? 1;
  const canNavigate = Boolean(onPageChange && fileUrl && !hasLoadError);

  return (
    <div className="flex h-full flex-col bg-[#fbfafc]">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium text-muted-foreground">PDF Viewer</h2>
        {canNavigate && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={pageNumber <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[4.5rem] text-center text-xs text-muted-foreground">
                {pageNumber} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={numPages === null || pageNumber >= numPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleJumpToPage} className="flex items-center gap-1">
              <Input
                ref={jumpInputRef}
                type="number"
                min={1}
                max={totalPages}
                step={1}
                placeholder="Page"
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                className="h-7 w-20 text-xs"
                aria-label="Page number"
              />
              <Button type="submit" variant="outline" size="sm" className="h-7 px-2 text-xs">
                Go
              </Button>
            </form>
          </div>
        )}
      </div>

      <div ref={containerRef} className="relative flex-1 overflow-auto p-5">
        {!fileUrl ? (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/60 p-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">PDF URL unavailable</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The file could not be loaded. You can delete it and upload a new one.
              </p>
            </div>
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete PDF
              </Button>
            )}
          </div>
        ) : hasLoadError ? (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 p-8">
            <p className="text-sm font-medium text-destructive">Failed to load PDF</p>
            <p className="text-center text-xs text-muted-foreground">
              The file could not be displayed. You can delete it and upload a new one.
            </p>
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete PDF
              </Button>
            )}
          </div>
        ) : (
          <div className="relative mx-auto w-full max-w-[720px]">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/75 backdrop-blur-sm">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}

            <Document
              key={fileUrl}
              file={fileUrl}
              loading=""
              onLoadSuccess={({ numPages: n }) => setNumPages(n)}
              onLoadError={handleLoadError}
              onSourceError={handleLoadError}
            >
              <div className="relative rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(31,31,36,0.08)]">
                <Page
                  pageNumber={pageNumber}
                  width={effectiveWidth || undefined}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  onLoadSuccess={(page) => {
                    setPageHeightRatio(page.height / page.width);
                    setIsLoading(false);
                  }}
                  onLoadError={handleLoadError}
                  onRenderError={handleLoadError}
                />
                {overlayStyle && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute rounded-md border-2 border-[#E85D75] bg-[rgba(232,93,117,0.08)]"
                    style={overlayStyle}
                  />
                )}
              </div>
            </Document>
          </div>
        )}
      </div>
    </div>
  );
}
