-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionType" ADD VALUE 'SITUATIONAL';
ALTER TYPE "QuestionType" ADD VALUE 'LIKERT';

-- AlterTable
ALTER TABLE "question_options" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "competency" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN     "status" "QuestionStatus" NOT NULL DEFAULT 'PUBLISHED';
