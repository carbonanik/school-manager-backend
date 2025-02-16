/*
  Warnings:

  - Made the column `name` on table `Parent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Parent" ALTER COLUMN "name" SET NOT NULL;
