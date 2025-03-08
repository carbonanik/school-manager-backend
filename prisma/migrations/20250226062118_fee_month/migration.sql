-- AlterTable
ALTER TABLE "Fee" ADD COLUMN     "feeTypeId" INTEGER,
ADD COLUMN     "months" INTEGER[],
ADD COLUMN     "year" INTEGER;

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES "FeeType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
