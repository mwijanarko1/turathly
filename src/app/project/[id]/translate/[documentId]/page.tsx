"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Check
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Document, Segment } from "@/lib/types";

function createSampleDocument(documentId: string, projectId: string): Document {
  return {
    _id: documentId,
    projectId,
    fileUrl: "",
    title: "Sample Document",
    status: "ready",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function createSampleSegments(documentId: string): Segment[] {
  return [
    {
      _id: "1",
      documentId,
      pageNumber: 1,
      text: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
      bbox: { x: 0, y: 0, w: 100, h: 20 },
      orderIndex: 0,
    },
    {
      _id: "2",
      documentId,
      pageNumber: 1,
      text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      bbox: { x: 0, y: 25, w: 100, h: 20 },
      orderIndex: 1,
    },
    {
      _id: "3",
      documentId,
      pageNumber: 1,
      text: "الرَّحْمَنِ الرَّحِيمِ",
      bbox: { x: 0, y: 50, w: 100, h: 20 },
      orderIndex: 2,
    },
  ];
}

function createInitialTranslations() {
  return {
    "1": "In the name of Allah, the Most Gracious, the Most Merciful.",
    "2": "Praise be to Allah, Lord of the Worlds.",
    "3": "The Most Gracious, the Most Merciful.",
  };
}

export default function TranslatePage() {
  const params = useParams();
  const projectId = params.id as string;
  const documentId = params.documentId as string;
  
  const [document] = useState<Document>(() => createSampleDocument(documentId, projectId));
  const [segments] = useState<Segment[]>(() => createSampleSegments(documentId));
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [editingTranslations, setEditingTranslations] = useState<Record<string, string>>(createInitialTranslations);
  const [savingSegments, setSavingSegments] = useState<Set<string>>(new Set());
  const [savedSegments, setSavedSegments] = useState<Set<string>>(new Set());
  const saveTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    return () => {
      Object.values(saveTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  const pageNumbers = [...new Set(segments.map((s) => s.pageNumber))].sort((a, b) => a - b);
  const pageSegments = segments.filter((s) => s.pageNumber === currentPage);

  const handleTranslationChange = useCallback((segmentId: string, value: string) => {
    setEditingTranslations(prev => ({ ...prev, [segmentId]: value }));
    setSavedSegments(prev => {
      const next = new Set(prev);
      next.delete(segmentId);
      return next;
    });

    if (saveTimeoutRef.current[segmentId]) {
      clearTimeout(saveTimeoutRef.current[segmentId]);
    }

    saveTimeoutRef.current[segmentId] = setTimeout(() => {
      setSavingSegments(prev => new Set(prev).add(segmentId));
      setTimeout(() => {
        setSavingSegments(prev => {
          const next = new Set(prev);
          next.delete(segmentId);
          return next;
        });
        setSavedSegments(prev => new Set(prev).add(segmentId));
      }, 300);
    }, 500);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card shrink-0">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/project/${projectId}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-heading text-lg font-semibold text-primary">
                  Turathl<span className="text-accent">y</span>
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[100px] text-center">
                  Page {currentPage} of {pageNumbers.length || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(pageNumbers.length, p + 1))}
                  disabled={currentPage >= pageNumbers.length}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export DOCX
              </Button>
            </div>
          </div>
          
          <div className="mt-2">
            <h1 className="font-heading text-lg font-semibold">
              {document.title || "Untitled Document"}
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 border-r border-border bg-card">
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center p-8">
              <p className="text-sm">PDF viewer</p>
              <p className="text-xs mt-1">Page {currentPage}</p>
            </div>
          </div>
        </div>

        <ScrollArea className="w-[400px] border-r border-border">
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Arabic Source
            </h3>
            <div className="space-y-3">
              {pageSegments.map((segment) => (
                <Card
                  key={segment._id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedSegmentId === segment._id 
                      ? 'border-accent bg-accent/5' 
                      : 'hover:border-primary/20'
                  }`}
                  onClick={() => setSelectedSegmentId(segment._id)}
                >
                  <p className="font-arabic text-lg leading-relaxed text-right">
                    {segment.text}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Translation
            </h3>
            <div className="space-y-4">
              {pageSegments.map((segment) => {
                const isSaving = savingSegments.has(segment._id);
                const isSaved = savedSegments.has(segment._id);
                
                return (
                  <div key={segment._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Segment {segment.orderIndex + 1}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {isSaving && (
                          <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                        )}
                        {isSaved && !isSaving && (
                          <Check className="w-3 h-3 text-green-600" />
                        )}
                      </div>
                    </div>
                    <Textarea
                      value={editingTranslations[segment._id] || ""}
                      onChange={(e) => handleTranslationChange(segment._id, e.target.value)}
                      placeholder="Enter translation..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
