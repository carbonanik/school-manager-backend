-- DropForeignKey
ALTER TABLE "SchoolAdmin" DROP CONSTRAINT "SchoolAdmin_schooId_fkey";

-- CreateTable
CREATE TABLE "_SchoolToSchoolAdmin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SchoolToSchoolAdmin_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SchoolToSchoolAdmin_B_index" ON "_SchoolToSchoolAdmin"("B");

-- AddForeignKey
ALTER TABLE "_SchoolToSchoolAdmin" ADD CONSTRAINT "_SchoolToSchoolAdmin_A_fkey" FOREIGN KEY ("A") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchoolToSchoolAdmin" ADD CONSTRAINT "_SchoolToSchoolAdmin_B_fkey" FOREIGN KEY ("B") REFERENCES "SchoolAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
