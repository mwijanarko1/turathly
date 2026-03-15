export const api = {
  users: {
    getByClerkId: "users:getByClerkId" as any,
    create: "users:create" as any,
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
    create: "documents:create" as any,
    updateStatus: "documents:updateStatus" as any,
    update: "documents:update" as any,
    remove: "documents:remove" as any,
  },
  segments: {
    listByDocument: "segments:listByDocument" as any,
    listByPage: "segments:listByPage" as any,
    create: "segments:create" as any,
    batchCreate: "segments:batchCreate" as any,
  },
  translations: {
    getBySegment: "translations:getBySegment" as any,
    listByDocument: "translations:listByDocument" as any,
    upsert: "translations:upsert" as any,
    createBatch: "translations:createBatch" as any,
  },
};