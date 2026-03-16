export const api = {
  export: {
    exportDocument: "export:exportDocument" as any,
  },
  users: {
    getByClerkId: "users:getByClerkId" as any,
    create: "users:create" as any,
    ensureCurrentUser: "users:ensureCurrentUser" as any,
    getCurrentUser: "users:getCurrentUser" as any,
  },
  projects: {
    listByOwner: "projects:listByOwner" as any,
    getById: "projects:getById" as any,
    create: "projects:create" as any,
    update: "projects:update" as any,
    remove: "projects:remove" as any,
  },
  documents: {
    listByProject: "documents:listByProject" as any,
    getById: "documents:getById" as any,
    generateUploadUrl: "documents:generateUploadUrl" as any,
    create: "documents:create" as any,
    updateStatus: "documents:updateStatus" as any,
    update: "documents:update" as any,
    remove: "documents:remove" as any,
    reOCRPage: "documents:reOCRPage" as any,
    translateDocument: "documents:translateDocument" as any,
    translatePage: "documents:translatePage" as any,
  },
  segments: {
    listByDocument: "segments:listByDocument" as any,
    listByPage: "segments:listByPage" as any,
    update: "segments:update" as any,
  },
  translations: {
    getBySegment: "translations:getBySegment" as any,
    listByDocument: "translations:listByDocument" as any,
    listByDocumentInternal: "translations:listByDocumentInternal" as any,
    upsert: "translations:upsert" as any,
    createBatch: "translations:createBatch" as any,
    clearByDocument: "translations:clearByDocument" as any,
  },
  ocr: {
    processDocument: "ocr:processDocument" as any,
  },
  translate: {
    translateDocument: "translate:translateDocument" as any,
  },
};
