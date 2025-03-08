-- CreateEnum
CREATE TYPE "BillingType" AS ENUM ('Monthly', 'Yearly', 'OneTime');

-- AlterTable
ALTER TABLE "FeeType" ADD COLUMN     "billingType" "BillingType";
