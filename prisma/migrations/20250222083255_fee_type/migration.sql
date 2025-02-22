-- CreateTable
CREATE TABLE "FeeType" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "amount" DOUBLE PRECISION,
    "schoolId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeeType" ADD CONSTRAINT "FeeType_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
