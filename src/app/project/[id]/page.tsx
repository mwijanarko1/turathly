"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Upload, 
  ArrowLeft,
  Clock,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import type { Document } from "@/lib/types";
import { useConvexAvailable } from "@/lib/providers";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; color: string; icon: typeof FileText }> = {
  uploaded: { label: "Uploaded", color: "secondary", icon: FileText },
  ocr_processing: { label: "Processing OCR", color: "default", icon: Loader2 },
  ocr_complete: { label: "OCR Complete", color: "secondary", icon: CheckCircle },
  translating: { label: "Translating", color: "default", icon: Loader2 },
  ready: { label: "Ready", color: "success", icon: CheckCircle },
  error: { label: "Error", color: "destructive", icon: AlertCircle },
};

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const convexAvailable = useConvexAvailable();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const project = {
    title: "Translation Project",
    genre: "general" as const,
    sourceLang: "Arabic",
    targetLang: "English",
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newDoc: Document = {
        _id: Date.now().toString(),
        projectId,
        fileUrl: URL.createObjectURL(file),
        title: file.name.replace('.pdf', ''),
        status: "uploaded",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setDocuments(prev => [newDoc, ...prev]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  }, [projectId]);

  useEffect(() => {
    return () => {
      documents.forEach((doc) => {
        if (doc.fileUrl.startsWith("blob:")) {
          URL.revokeObjectURL(doc.fileUrl);
        }
      });
    };
  }, [documents]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                <span className="font-heading text-xl font-semibold text-primary">
                  Turathl<span className="text-accent">y</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!convexAvailable && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
            <p className="text-sm">
              Convex is not configured. Please set up your Convex deployment to enable full functionality.
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {project.title}
            </h1>
            <Badge variant="secondary">{project.genre || "general"}</Badge>
          </div>
          <p className="text-muted-foreground">
            {project.sourceLang} → {project.targetLang}
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-semibold">Documents</h2>
          <div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
              disabled={isUploading}
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <span className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </>
                )}
              </span>
            </label>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">
              No documents yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Upload a PDF to start translating
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => {
              const status = statusConfig[doc.status] || statusConfig.uploaded;
              const StatusIcon = status.icon;
              
              return (
                <Card key={doc._id} className="hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">
                        {doc.title || "Untitled Document"}
                      </CardTitle>
                      <Badge className="ml-2">
                        <StatusIcon className={`w-3 h-3 mr-1 ${doc.status === "ocr_processing" || doc.status === "translating" ? "animate-spin" : ""}`} />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(doc.updatedAt)}
                      </div>
                      {doc.status === "ready" && (
                        <Link href={`/project/${projectId}/translate/${doc._id}`}>
                          <Button size="sm">
                            Open Workspace
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
