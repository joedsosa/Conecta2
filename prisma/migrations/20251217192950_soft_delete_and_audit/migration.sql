-- AlterTable
ALTER TABLE "Job" ADD COLUMN "deletedAt" DATETIME;
ALTER TABLE "Job" ADD COLUMN "deletedBy" TEXT;

-- CreateTable
CREATE TABLE "JobAudit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JobAudit_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "JobAudit_jobId_idx" ON "JobAudit"("jobId");

-- CreateIndex
CREATE INDEX "JobAudit_createdAt_idx" ON "JobAudit"("createdAt");
