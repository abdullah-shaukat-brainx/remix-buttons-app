/*
  Warnings:

  - You are about to drop the column `radius` on the `Button` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Button" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "showName" BOOLEAN NOT NULL DEFAULT false,
    "variant" TEXT NOT NULL DEFAULT 'none',
    "size" TEXT NOT NULL DEFAULT 'large'
);
INSERT INTO "new_Button" ("enable", "id", "size", "variant") SELECT "enable", "id", "size", "variant" FROM "Button";
DROP TABLE "Button";
ALTER TABLE "new_Button" RENAME TO "Button";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
