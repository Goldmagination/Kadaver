-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "continuationOfWorkId" TEXT,
ADD COLUMN     "isContinuation" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Work" ADD COLUMN     "status" "WorkStatus" NOT NULL DEFAULT 'COMPLETED';
