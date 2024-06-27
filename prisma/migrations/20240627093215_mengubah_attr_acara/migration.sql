/*
  Warnings:

  - You are about to drop the column `tanggal` on the `acara` table. All the data in the column will be lost.
  - Added the required column `deskripsi` to the `acara` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "acara" DROP COLUMN "tanggal",
ADD COLUMN     "deskripsi" TEXT NOT NULL;
