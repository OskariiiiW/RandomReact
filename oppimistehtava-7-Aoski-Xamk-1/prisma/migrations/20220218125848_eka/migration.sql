-- CreateTable
CREATE TABLE "Keskustelu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttaja" TEXT NOT NULL,
    "otsikko" TEXT NOT NULL,
    "sisalto" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
