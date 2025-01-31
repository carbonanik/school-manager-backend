/*
  Warnings:

  - You are about to drop the column `password` on the `CentralAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `usernameId` on the `CentralAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `usernameId` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `SchoolAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `usernameId` on the `SchoolAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `usernameId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `usernameId` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the `Username` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[authId]` on the table `CentralAdmin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authId]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authId]` on the table `SchoolAdmin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authId` to the `CentralAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authId` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authId` to the `SchoolAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authId` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CentralAdmin" DROP CONSTRAINT "CentralAdmin_usernameId_fkey";

-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_usernameId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolAdmin" DROP CONSTRAINT "SchoolAdmin_usernameId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_usernameId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_usernameId_fkey";

-- DropIndex
DROP INDEX "CentralAdmin_usernameId_key";

-- DropIndex
DROP INDEX "Parent_usernameId_key";

-- DropIndex
DROP INDEX "SchoolAdmin_usernameId_key";

-- DropIndex
DROP INDEX "Student_usernameId_key";

-- DropIndex
DROP INDEX "Teacher_usernameId_key";

-- AlterTable
ALTER TABLE "CentralAdmin" DROP COLUMN "password",
DROP COLUMN "usernameId",
ADD COLUMN     "authId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "password",
DROP COLUMN "usernameId",
ADD COLUMN     "authId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SchoolAdmin" DROP COLUMN "password",
DROP COLUMN "usernameId",
ADD COLUMN     "authId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "password",
DROP COLUMN "usernameId",
ADD COLUMN     "authId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "password",
DROP COLUMN "usernameId",
ADD COLUMN     "authId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Username";

-- CreateTable
CREATE TABLE "AuthInfo" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "AuthInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthInfo_username_key" ON "AuthInfo"("username");

-- CreateIndex
CREATE UNIQUE INDEX "CentralAdmin_authId_key" ON "CentralAdmin"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_authId_key" ON "Parent"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAdmin_authId_key" ON "SchoolAdmin"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_authId_key" ON "Student"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_authId_key" ON "Teacher"("authId");

-- AddForeignKey
ALTER TABLE "CentralAdmin" ADD CONSTRAINT "CentralAdmin_authId_fkey" FOREIGN KEY ("authId") REFERENCES "AuthInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAdmin" ADD CONSTRAINT "SchoolAdmin_authId_fkey" FOREIGN KEY ("authId") REFERENCES "AuthInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_authId_fkey" FOREIGN KEY ("authId") REFERENCES "AuthInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_authId_fkey" FOREIGN KEY ("authId") REFERENCES "AuthInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_authId_fkey" FOREIGN KEY ("authId") REFERENCES "AuthInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
