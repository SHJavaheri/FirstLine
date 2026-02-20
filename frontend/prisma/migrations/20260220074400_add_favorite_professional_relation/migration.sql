-- AlterTable
ALTER TABLE "ProfessionalProfile" ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "professionalBio" TEXT;

-- CreateTable
CREATE TABLE "FavoriteProfessional" (
    "id" TEXT NOT NULL,
    "consumerId" TEXT NOT NULL,
    "professionalProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteProfessional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavoriteProfessional_consumerId_idx" ON "FavoriteProfessional"("consumerId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteProfessional_consumerId_professionalProfileId_key" ON "FavoriteProfessional"("consumerId", "professionalProfileId");

-- AddForeignKey
ALTER TABLE "FavoriteProfessional" ADD CONSTRAINT "FavoriteProfessional_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteProfessional" ADD CONSTRAINT "FavoriteProfessional_professionalProfileId_fkey" FOREIGN KEY ("professionalProfileId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
