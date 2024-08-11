/*
  Warnings:

  - The primary key for the `panitia_rapat_bph` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `rapat_bph` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `rapat_bph` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "panitia_rapat_bph" DROP CONSTRAINT "panitia_rapat_bph_waktu_rapat_divisi_bph_id_fkey";

-- AlterTable
ALTER TABLE "panitia_rapat_bph" DROP CONSTRAINT "panitia_rapat_bph_pkey",
ADD CONSTRAINT "panitia_rapat_bph_pkey" PRIMARY KEY ("panitia_username", "divisi_bph_id");

-- AlterTable
ALTER TABLE "rapat_bph" DROP CONSTRAINT "rapat_bph_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "rapat_bph_pkey" PRIMARY KEY ("divisi_bph_id", "id");

-- AddForeignKey
ALTER TABLE "panitia_rapat_bph" ADD CONSTRAINT "panitia_rapat_bph_panitia_username_divisi_bph_id_fkey" FOREIGN KEY ("panitia_username", "divisi_bph_id") REFERENCES "rapat_bph"("id", "divisi_bph_id") ON DELETE CASCADE ON UPDATE CASCADE;
