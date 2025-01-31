/*
  Warnings:

  - A unique constraint covering the columns `[usernameId]` on the table `CentralAdmin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usernameId]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usernameId]` on the table `SchoolAdmin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usernameId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usernameId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usernameId` to the `CentralAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usernameId` to the `SchoolAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CentralAdmin" ADD COLUMN     "usernameId" INTEGER NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "password" TEXT,
ADD COLUMN     "usernameId" INTEGER;

-- AlterTable
ALTER TABLE "SchoolAdmin" ADD COLUMN     "usernameId" INTEGER NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "password" TEXT,
ADD COLUMN     "usernameId" INTEGER;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "password" TEXT,
ADD COLUMN     "usernameId" INTEGER;

-- CreateTable
CREATE TABLE "Username" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Username_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Username_username_key" ON "Username"("username");

-- CreateIndex
CREATE UNIQUE INDEX "CentralAdmin_usernameId_key" ON "CentralAdmin"("usernameId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_usernameId_key" ON "Parent"("usernameId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAdmin_usernameId_key" ON "SchoolAdmin"("usernameId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_usernameId_key" ON "Student"("usernameId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_usernameId_key" ON "Teacher"("usernameId");

-- AddForeignKey
ALTER TABLE "CentralAdmin" ADD CONSTRAINT "CentralAdmin_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "Username"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAdmin" ADD CONSTRAINT "SchoolAdmin_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "Username"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "Username"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "Username"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "Username"("id") ON DELETE SET NULL ON UPDATE CASCADE;
