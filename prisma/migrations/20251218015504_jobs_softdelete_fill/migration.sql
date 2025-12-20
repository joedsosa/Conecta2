-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "type" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "deletedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "filledAt" DATETIME,
    "hiredName" TEXT,
    "hiredContact" TEXT,
    "hiredNotes" TEXT
);
INSERT INTO "new_Job" ("active", "createdAt", "deletedAt", "deletedBy", "description", "id", "location", "title", "type", "updatedAt") SELECT "active", "createdAt", "deletedAt", "deletedBy", "description", "id", "location", "title", "type", "updatedAt" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
