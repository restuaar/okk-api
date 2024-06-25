/*
  Warnings:

  - You are about to drop the column `nama` on the `mentee` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `panitia` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `pembicara` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `sponsor` table. All the data in the column will be lost.
  - Added the required column `nama` to the `akun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "akun" ADD COLUMN     "nama" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "mentee" DROP COLUMN "nama";

-- AlterTable
ALTER TABLE "panitia" DROP COLUMN "nama";

-- AlterTable
ALTER TABLE "pembicara" DROP COLUMN "nama";

-- AlterTable
ALTER TABLE "sponsor" DROP COLUMN "nama";
