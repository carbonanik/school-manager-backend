/*
  Warnings:

  - You are about to drop the column `paidAmount` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "paidAmount",
DROP COLUMN "totalAmount";
