/*
  Warnings:

  - You are about to drop the column `waktuMulai` on the `acara` table. All the data in the column will be lost.
  - You are about to drop the column `waktuSelesai` on the `acara` table. All the data in the column will be lost.
  - The primary key for the `acara_pembicara` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `acaraId` on the `acara_pembicara` table. All the data in the column will be lost.
  - You are about to drop the column `pembicaraId` on the `acara_pembicara` table. All the data in the column will be lost.
  - The primary key for the `acara_sponsor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `acaraId` on the `acara_sponsor` table. All the data in the column will be lost.
  - You are about to drop the column `sponsorId` on the `acara_sponsor` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `akun` table. All the data in the column will be lost.
  - You are about to drop the column `divisiBagian` on the `divisi_bph` table. All the data in the column will be lost.
  - You are about to drop the column `usernameMentor` on the `kelompok_okk` table. All the data in the column will be lost.
  - You are about to drop the column `noKelompokOKK` on the `mentee` table. All the data in the column will be lost.
  - The primary key for the `mentee_mentoring` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `menteeUsername` on the `mentee_mentoring` table. All the data in the column will be lost.
  - You are about to drop the column `mentoringNoKelompokOKK` on the `mentee_mentoring` table. All the data in the column will be lost.
  - You are about to drop the column `mentoringWaktu` on the `mentee_mentoring` table. All the data in the column will be lost.
  - You are about to drop the column `waktuHadir` on the `mentee_mentoring` table. All the data in the column will be lost.
  - The primary key for the `mentoring` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `noKelompokOKK` on the `mentoring` table. All the data in the column will be lost.
  - You are about to drop the column `divisiBPHId` on the `panitia` table. All the data in the column will be lost.
  - You are about to drop the column `divisiPIId` on the `panitia` table. All the data in the column will be lost.
  - The primary key for the `panitia_rapat_bph` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `panitiaUsername` on the `panitia_rapat_bph` table. All the data in the column will be lost.
  - You are about to drop the column `rapatBPHDivisiBPHId` on the `panitia_rapat_bph` table. All the data in the column will be lost.
  - You are about to drop the column `rapatBPHWaktu` on the `panitia_rapat_bph` table. All the data in the column will be lost.
  - You are about to drop the column `waktuHadir` on the `panitia_rapat_bph` table. All the data in the column will be lost.
  - The primary key for the `rapat_bph` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `divisiBPHId` on the `rapat_bph` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username_mentor]` on the table `kelompok_okk` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[divisi_pi_id]` on the table `panitia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `waktu_mulai` to the `acara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu_selesai` to the `acara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_acara` to the `acara_pembicara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_pembicara` to the `acara_pembicara` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_acara` to the `acara_sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_sponsor` to the `acara_sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divisi_bagian` to the `divisi_bph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username_mentor` to the `kelompok_okk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_kelompok_okk` to the `mentee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mentee_username` to the `mentee_mentoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_kelompok` to the `mentee_mentoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu_hadir` to the `mentee_mentoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu_mentoring` to the `mentee_mentoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `no_kelompok` to the `mentoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divisi_bph_id` to the `panitia_rapat_bph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `panitia_username` to the `panitia_rapat_bph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu_hadir` to the `panitia_rapat_bph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waktu_rapat` to the `panitia_rapat_bph` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divisi_bph_id` to the `rapat_bph` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "acara_pembicara" DROP CONSTRAINT "acara_pembicara_acaraId_fkey";

-- DropForeignKey
ALTER TABLE "acara_pembicara" DROP CONSTRAINT "acara_pembicara_pembicaraId_fkey";

-- DropForeignKey
ALTER TABLE "acara_sponsor" DROP CONSTRAINT "acara_sponsor_acaraId_fkey";

-- DropForeignKey
ALTER TABLE "acara_sponsor" DROP CONSTRAINT "acara_sponsor_sponsorId_fkey";

-- DropForeignKey
ALTER TABLE "divisi_bph" DROP CONSTRAINT "divisi_bph_divisiBagian_fkey";

-- DropForeignKey
ALTER TABLE "kelompok_okk" DROP CONSTRAINT "kelompok_okk_usernameMentor_fkey";

-- DropForeignKey
ALTER TABLE "mentee" DROP CONSTRAINT "mentee_noKelompokOKK_fkey";

-- DropForeignKey
ALTER TABLE "mentee_mentoring" DROP CONSTRAINT "mentee_mentoring_menteeUsername_fkey";

-- DropForeignKey
ALTER TABLE "mentee_mentoring" DROP CONSTRAINT "mentee_mentoring_mentoringWaktu_mentoringNoKelompokOKK_fkey";

-- DropForeignKey
ALTER TABLE "mentoring" DROP CONSTRAINT "mentoring_noKelompokOKK_fkey";

-- DropForeignKey
ALTER TABLE "panitia" DROP CONSTRAINT "panitia_divisiBPHId_fkey";

-- DropForeignKey
ALTER TABLE "panitia" DROP CONSTRAINT "panitia_divisiPIId_fkey";

-- DropForeignKey
ALTER TABLE "panitia_rapat_bph" DROP CONSTRAINT "panitia_rapat_bph_panitiaUsername_fkey";

-- DropForeignKey
ALTER TABLE "panitia_rapat_bph" DROP CONSTRAINT "panitia_rapat_bph_rapatBPHWaktu_rapatBPHDivisiBPHId_fkey";

-- DropForeignKey
ALTER TABLE "rapat_bph" DROP CONSTRAINT "rapat_bph_divisiBPHId_fkey";

-- DropIndex
DROP INDEX "kelompok_okk_usernameMentor_key";

-- DropIndex
DROP INDEX "panitia_divisiPIId_key";

-- AlterTable
ALTER TABLE "acara" DROP COLUMN "waktuMulai",
DROP COLUMN "waktuSelesai",
ADD COLUMN     "waktu_mulai" TIMESTAMP NOT NULL,
ADD COLUMN     "waktu_selesai" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "acara_pembicara" DROP CONSTRAINT "acara_pembicara_pkey",
DROP COLUMN "acaraId",
DROP COLUMN "pembicaraId",
ADD COLUMN     "id_acara" VARCHAR(100) NOT NULL,
ADD COLUMN     "id_pembicara" VARCHAR(100) NOT NULL,
ADD CONSTRAINT "acara_pembicara_pkey" PRIMARY KEY ("id_acara", "id_pembicara");

-- AlterTable
ALTER TABLE "acara_sponsor" DROP CONSTRAINT "acara_sponsor_pkey",
DROP COLUMN "acaraId",
DROP COLUMN "sponsorId",
ADD COLUMN     "id_acara" VARCHAR(100) NOT NULL,
ADD COLUMN     "id_sponsor" VARCHAR(100) NOT NULL,
ADD CONSTRAINT "acara_sponsor_pkey" PRIMARY KEY ("id_acara", "id_sponsor");

-- AlterTable
ALTER TABLE "akun" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "divisi_bph" DROP COLUMN "divisiBagian",
ADD COLUMN     "divisi_bagian" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "kelompok_okk" DROP COLUMN "usernameMentor",
ADD COLUMN     "username_mentor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mentee" DROP COLUMN "noKelompokOKK",
ADD COLUMN     "no_kelompok_okk" SMALLINT NOT NULL;

-- AlterTable
ALTER TABLE "mentee_mentoring" DROP CONSTRAINT "mentee_mentoring_pkey",
DROP COLUMN "menteeUsername",
DROP COLUMN "mentoringNoKelompokOKK",
DROP COLUMN "mentoringWaktu",
DROP COLUMN "waktuHadir",
ADD COLUMN     "mentee_username" VARCHAR(100) NOT NULL,
ADD COLUMN     "no_kelompok" INTEGER NOT NULL,
ADD COLUMN     "waktu_hadir" TIMESTAMP NOT NULL,
ADD COLUMN     "waktu_mentoring" TIMESTAMP NOT NULL,
ADD CONSTRAINT "mentee_mentoring_pkey" PRIMARY KEY ("mentee_username", "waktu_mentoring", "no_kelompok");

-- AlterTable
ALTER TABLE "mentoring" DROP CONSTRAINT "mentoring_pkey",
DROP COLUMN "noKelompokOKK",
ADD COLUMN     "no_kelompok" SMALLINT NOT NULL,
ADD CONSTRAINT "mentoring_pkey" PRIMARY KEY ("no_kelompok", "waktu");

-- AlterTable
ALTER TABLE "panitia" DROP COLUMN "divisiBPHId",
DROP COLUMN "divisiPIId",
ADD COLUMN     "divisi_bph_id" TEXT,
ADD COLUMN     "divisi_pi_id" TEXT;

-- AlterTable
ALTER TABLE "panitia_rapat_bph" DROP CONSTRAINT "panitia_rapat_bph_pkey",
DROP COLUMN "panitiaUsername",
DROP COLUMN "rapatBPHDivisiBPHId",
DROP COLUMN "rapatBPHWaktu",
DROP COLUMN "waktuHadir",
ADD COLUMN     "divisi_bph_id" TEXT NOT NULL,
ADD COLUMN     "panitia_username" VARCHAR(100) NOT NULL,
ADD COLUMN     "waktu_hadir" TIMESTAMP NOT NULL,
ADD COLUMN     "waktu_rapat" TIMESTAMP NOT NULL,
ADD CONSTRAINT "panitia_rapat_bph_pkey" PRIMARY KEY ("panitia_username", "waktu_rapat", "divisi_bph_id");

-- AlterTable
ALTER TABLE "rapat_bph" DROP CONSTRAINT "rapat_bph_pkey",
DROP COLUMN "divisiBPHId",
ADD COLUMN     "divisi_bph_id" TEXT NOT NULL,
ADD CONSTRAINT "rapat_bph_pkey" PRIMARY KEY ("divisi_bph_id", "waktu");

-- CreateIndex
CREATE UNIQUE INDEX "kelompok_okk_username_mentor_key" ON "kelompok_okk"("username_mentor");

-- CreateIndex
CREATE UNIQUE INDEX "panitia_divisi_pi_id_key" ON "panitia"("divisi_pi_id");

-- AddForeignKey
ALTER TABLE "panitia" ADD CONSTRAINT "panitia_divisi_pi_id_fkey" FOREIGN KEY ("divisi_pi_id") REFERENCES "divisi_pi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia" ADD CONSTRAINT "panitia_divisi_bph_id_fkey" FOREIGN KEY ("divisi_bph_id") REFERENCES "divisi_bph"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divisi_bph" ADD CONSTRAINT "divisi_bph_divisi_bagian_fkey" FOREIGN KEY ("divisi_bagian") REFERENCES "divisi_pi"("nama") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rapat_bph" ADD CONSTRAINT "rapat_bph_divisi_bph_id_fkey" FOREIGN KEY ("divisi_bph_id") REFERENCES "divisi_bph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia_rapat_bph" ADD CONSTRAINT "panitia_rapat_bph_panitia_username_fkey" FOREIGN KEY ("panitia_username") REFERENCES "panitia"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia_rapat_bph" ADD CONSTRAINT "panitia_rapat_bph_waktu_rapat_divisi_bph_id_fkey" FOREIGN KEY ("waktu_rapat", "divisi_bph_id") REFERENCES "rapat_bph"("waktu", "divisi_bph_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok_okk" ADD CONSTRAINT "kelompok_okk_username_mentor_fkey" FOREIGN KEY ("username_mentor") REFERENCES "panitia"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee" ADD CONSTRAINT "mentee_no_kelompok_okk_fkey" FOREIGN KEY ("no_kelompok_okk") REFERENCES "kelompok_okk"("no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentoring" ADD CONSTRAINT "mentoring_no_kelompok_fkey" FOREIGN KEY ("no_kelompok") REFERENCES "kelompok_okk"("no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_mentoring" ADD CONSTRAINT "mentee_mentoring_mentee_username_fkey" FOREIGN KEY ("mentee_username") REFERENCES "mentee"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_mentoring" ADD CONSTRAINT "mentee_mentoring_waktu_mentoring_no_kelompok_fkey" FOREIGN KEY ("waktu_mentoring", "no_kelompok") REFERENCES "mentoring"("waktu", "no_kelompok") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_sponsor" ADD CONSTRAINT "acara_sponsor_id_acara_fkey" FOREIGN KEY ("id_acara") REFERENCES "acara"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_sponsor" ADD CONSTRAINT "acara_sponsor_id_sponsor_fkey" FOREIGN KEY ("id_sponsor") REFERENCES "sponsor"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_pembicara" ADD CONSTRAINT "acara_pembicara_id_acara_fkey" FOREIGN KEY ("id_acara") REFERENCES "acara"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_pembicara" ADD CONSTRAINT "acara_pembicara_id_pembicara_fkey" FOREIGN KEY ("id_pembicara") REFERENCES "pembicara"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
