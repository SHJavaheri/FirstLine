-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "consumerId" TEXT NOT NULL,
    "professionalProfileId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rating_professionalProfileId_idx" ON "Rating"("professionalProfileId");

-- CreateIndex
CREATE INDEX "Rating_consumerId_idx" ON "Rating"("consumerId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_consumerId_professionalProfileId_key" ON "Rating"("consumerId", "professionalProfileId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_professionalProfileId_fkey" FOREIGN KEY ("professionalProfileId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
