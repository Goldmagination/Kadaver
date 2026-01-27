/*
  Warnings:

  - The primary key for the `Favorite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `poemId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `approvedPoemId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `Poem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PoemTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Poet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workId` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('POEM', 'TALE', 'NOVEL');

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_poemId_fkey";

-- DropForeignKey
ALTER TABLE "Poem" DROP CONSTRAINT "Poem_poetId_fkey";

-- DropForeignKey
ALTER TABLE "PoemTag" DROP CONSTRAINT "PoemTag_poemId_fkey";

-- DropForeignKey
ALTER TABLE "PoemTag" DROP CONSTRAINT "PoemTag_tagId_fkey";

-- DropIndex
DROP INDEX "Favorite_poemId_idx";

-- AlterTable
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_pkey",
DROP COLUMN "poemId",
ADD COLUMN     "workId" TEXT NOT NULL,
ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY ("userId", "workId");

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "approvedPoemId",
ADD COLUMN     "approvedWorkId" TEXT,
ADD COLUMN     "type" "WorkType" NOT NULL DEFAULT 'POEM';

-- DropTable
DROP TABLE "Poem";

-- DropTable
DROP TABLE "PoemTag";

-- DropTable
DROP TABLE "Poet";

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameOriginal" TEXT,
    "bio" TEXT,
    "bioRu" TEXT,
    "bioDe" TEXT,
    "bioEn" TEXT,
    "portraitUrl" TEXT,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "nationality" TEXT,
    "languages" "Language"[],
    "wikipediaUrl" TEXT,
    "websiteUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "WorkType" NOT NULL DEFAULT 'POEM',
    "title" TEXT NOT NULL,
    "content" TEXT,
    "excerpt" TEXT,
    "language" "Language" NOT NULL,
    "authorId" TEXT NOT NULL,
    "audioUrl" TEXT,
    "audioDuration" INTEGER,
    "audioReader" TEXT,
    "renderingConfig" JSONB,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "workId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "renderingConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkTag" (
    "workId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkTag_pkey" PRIMARY KEY ("workId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

-- CreateIndex
CREATE INDEX "Author_slug_idx" ON "Author"("slug");

-- CreateIndex
CREATE INDEX "Author_featured_idx" ON "Author"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "Work_slug_key" ON "Work"("slug");

-- CreateIndex
CREATE INDEX "Work_slug_idx" ON "Work"("slug");

-- CreateIndex
CREATE INDEX "Work_type_idx" ON "Work"("type");

-- CreateIndex
CREATE INDEX "Work_language_idx" ON "Work"("language");

-- CreateIndex
CREATE INDEX "Work_authorId_idx" ON "Work"("authorId");

-- CreateIndex
CREATE INDEX "Work_published_featured_idx" ON "Work"("published", "featured");

-- CreateIndex
CREATE INDEX "Work_publishedAt_idx" ON "Work"("publishedAt");

-- CreateIndex
CREATE INDEX "Chapter_workId_order_idx" ON "Chapter"("workId", "order");

-- CreateIndex
CREATE INDEX "WorkTag_workId_idx" ON "WorkTag"("workId");

-- CreateIndex
CREATE INDEX "WorkTag_tagId_idx" ON "WorkTag"("tagId");

-- CreateIndex
CREATE INDEX "Favorite_workId_idx" ON "Favorite"("workId");

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkTag" ADD CONSTRAINT "WorkTag_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkTag" ADD CONSTRAINT "WorkTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
