-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_authId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_authId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_authId_fkey";

-- AlterTable
ALTER TABLE "Parent" ALTER COLUMN "authId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "authId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "authId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_authId_fkey" FOREIGN KEY ("authId") REFERENCES "AuthInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_authId_fkey" FOREIGN KEY ("authId") REFERENCES "AuthInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_authId_fkey" FOREIGN KEY ("authId") REFERENCES "AuthInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
