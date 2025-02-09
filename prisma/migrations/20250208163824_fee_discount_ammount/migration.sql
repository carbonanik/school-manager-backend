/*
  Warnings:

  - You are about to drop the column `amount` on the `Fee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Fee" DROP COLUMN "amount",
ADD COLUMN     "discountAmount" DOUBLE PRECISION;
