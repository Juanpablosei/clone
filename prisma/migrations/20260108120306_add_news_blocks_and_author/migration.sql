-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "linkedin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_blocks" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "images" TEXT[],
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_blocks_pkey" PRIMARY KEY ("id")
);

-- AlterTable: Eliminar columna author (ya no se usa)
ALTER TABLE "news" DROP COLUMN IF EXISTS "author";

-- AlterTable: Agregar authorId
ALTER TABLE "news" ADD COLUMN "authorId" TEXT;

-- AlterTable: Hacer image y content opcionales
ALTER TABLE "news" ALTER COLUMN "image" DROP NOT NULL;
ALTER TABLE "news" ALTER COLUMN "content" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "news_blocks_newsId_order_idx" ON "news_blocks"("newsId", "order");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_blocks" ADD CONSTRAINT "news_blocks_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE;

