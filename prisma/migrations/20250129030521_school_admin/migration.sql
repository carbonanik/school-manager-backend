/*
  Warnings:

  - Added the required column `email` to the `SchoolAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `SchoolAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SchoolAdmin" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "password" TEXT NOT NULL;
