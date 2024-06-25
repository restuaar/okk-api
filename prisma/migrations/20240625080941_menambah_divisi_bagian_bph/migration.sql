/*
  Warnings:

  - Added the required column `divisiBagian` to the `divisi_bph` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "divisi_bph" ADD COLUMN     "divisiBagian" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "divisi_bph" ADD CONSTRAINT "divisi_bph_divisiBagian_fkey" FOREIGN KEY ("divisiBagian") REFERENCES "divisi_PI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
