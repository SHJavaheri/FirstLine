-- AlterTable
ALTER TABLE "PersonalRecommendation" ADD COLUMN     "selectedTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "wouldUseAgain" TEXT;
