CREATE TABLE "Button" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "radius" INTEGER NOT NULL DEFAULT 0,
    "variant" TEXT NOT NULL DEFAULT 'none',
    "size" TEXT NOT NULL DEFAULT 'large'
);