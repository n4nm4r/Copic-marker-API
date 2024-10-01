/*
  Warnings:

  - You are about to drop the column `colorHex` on the `Copic` table. All the data in the column will be lost.
  - Added the required column `number` to the `Copic` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Copic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "colorName" TEXT NOT NULL,
    "colorCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "fileName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Copic" ("colorCode", "colorName", "createdAt", "fileName", "id", "type") SELECT "colorCode", "colorName", "createdAt", "fileName", "id", "type" FROM "Copic";
DROP TABLE "Copic";
ALTER TABLE "new_Copic" RENAME TO "Copic";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
