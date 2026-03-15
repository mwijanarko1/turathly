export interface Project {
  _id: string;
  ownerId: string;
  title: string;
  sourceLang: string;
  targetLang: string;
  genre?: "general" | "tafsir" | "fiqh" | "hadith" | "theology" | "biography";
  createdAt: number;
  updatedAt: number;
}

export interface Document {
  _id: string;
  projectId: string;
  fileUrl: string;
  storageId?: string;
  title?: string;
  pageCount?: number;
  status: "uploaded" | "ocr_processing" | "ocr_complete" | "translating" | "ready" | "error";
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Segment {
  _id: string;
  documentId: string;
  pageNumber: number;
  text: string;
  bbox: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  orderIndex: number;
}

export interface Translation {
  _id: string;
  segmentId: string;
  translation: string;
  aiGenerated: boolean;
  editedByUser: boolean;
  updatedAt: number;
}

export interface SegmentWithTranslation {
  segmentId: string;
  translation: Translation | null;
}