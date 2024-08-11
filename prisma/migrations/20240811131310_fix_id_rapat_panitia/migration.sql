/*
  Warnings:

  - The primary key for the `panitia_rapat_bph` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `rapat_id` to the `panitia_rapat_bph` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "panitia_rapat_bph" DROP CONSTRAINT "panitia_rapat_bph_panitia_username_divisi_bph_id_fkey";

-- AlterTable
ALTER TABLE "panitia_rapat_bph" DROP CONSTRAINT "panitia_rapat_bph_pkey",
ADD COLUMN     "rapat_id" VARCHAR(100) NOT NULL,
ADD CONSTRAINT "panitia_rapat_bph_pkey" PRIMARY KEY ("panitia_username", "divisi_bph_id", "rapat_id");

-- AddForeignKey
ALTER TABLE "panitia_rapat_bph" ADD CONSTRAINT "panitia_rapat_bph_rapat_id_divisi_bph_id_fkey" FOREIGN KEY ("rapat_id", "divisi_bph_id") REFERENCES "rapat_bph"("id", "divisi_bph_id") ON DELETE CASCADE ON UPDATE CASCADE;
