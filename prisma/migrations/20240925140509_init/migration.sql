-- CreateTable
CREATE TABLE "Copic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "colorName" TEXT NOT NULL,
    "colorCode" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
