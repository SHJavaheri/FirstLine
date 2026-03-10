-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "budgetMax" INTEGER,
ADD COLUMN     "budgetMin" INTEGER,
ADD COLUMN     "consultationPreference" TEXT,
ADD COLUMN     "distancePreference" INTEGER,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "identityVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notificationPreferences" JSONB,
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "serviceInterests" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "relatedId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_accountId_createdAt_idx" ON "ActivityLog"("accountId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_activityType_idx" ON "ActivityLog"("activityType");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
