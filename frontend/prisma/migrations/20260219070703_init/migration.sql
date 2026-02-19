/*
  Warnings:

  - You are about to drop the `Lawyer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('CONSUMER', 'PROFESSIONAL', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Lawyer" DROP CONSTRAINT "Lawyer_userId_fkey";

-- DropTable
DROP TABLE "Lawyer";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AccountRole" NOT NULL DEFAULT 'CONSUMER',
    "firstName" TEXT,
    "lastName" TEXT,
    "profilePhotoUrl" TEXT,
    "jobTitle" TEXT,
    "bio" TEXT,
    "locationCity" TEXT,
    "locationState" TEXT,
    "phone" TEXT,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalProfile" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "specializations" TEXT[],
    "hourlyRate" INTEGER,
    "yearsExperience" INTEGER,
    "location" TEXT,
    "firmName" TEXT,
    "firmAddress" TEXT,
    "firmWebsite" TEXT,
    "yearsAtCurrentFirm" INTEGER,
    "totalExperienceYears" INTEGER,
    "licenseNumber" TEXT,
    "licensingBody" TEXT,
    "licenseJurisdiction" TEXT,
    "pricingModel" TEXT,
    "pricingDetails" TEXT,
    "minRate" INTEGER,
    "maxRate" INTEGER,
    "acceptsNewClients" BOOLEAN NOT NULL DEFAULT true,
    "offersInPerson" BOOLEAN NOT NULL DEFAULT true,
    "offersRemote" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE INDEX "Account_createdAt_idx" ON "Account"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalProfile_accountId_key" ON "ProfessionalProfile"("accountId");

-- CreateIndex
CREATE INDEX "ProfessionalProfile_profession_idx" ON "ProfessionalProfile"("profession");

-- CreateIndex
CREATE INDEX "ProfessionalProfile_verified_idx" ON "ProfessionalProfile"("verified");

-- AddForeignKey
ALTER TABLE "ProfessionalProfile" ADD CONSTRAINT "ProfessionalProfile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
