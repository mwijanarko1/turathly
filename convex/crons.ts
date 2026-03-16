import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "process-pending-documents",
  { minutes: 2 },
  internal.documents.processPendingDocuments
);

export default crons;
