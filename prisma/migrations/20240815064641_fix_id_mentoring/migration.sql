/*
  Warnings:

  - The primary key for the `mentee_mentoring` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mentoring` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `mentoring_id` to the `mentee_mentoring` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `mentoring` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "mentee_mentoring" DROP CONSTRAINT "mentee_mentoring_waktu_mentoring_no_kelompok_fkey";

-- AlterTable
ALTER TABLE "mentee_mentoring" DROP CONSTRAINT "mentee_mentoring_pkey",
ADD COLUMN     "mentoring_id" VARCHAR(100) NOT NULL,
ADD CONSTRAINT "mentee_mentoring_pkey" PRIMARY KEY ("mentee_username", "mentoring_id", "no_kelompok");

-- AlterTable
ALTER TABLE "mentoring" DROP CONSTRAINT "mentoring_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "mentoring_pkey" PRIMARY KEY ("no_kelompok", "id");

-- AddForeignKey
ALTER TABLE "mentee_mentoring" ADD CONSTRAINT "mentee_mentoring_mentoring_id_no_kelompok_fkey" FOREIGN KEY ("mentoring_id", "no_kelompok") REFERENCES "mentoring"("id", "no_kelompok") ON DELETE CASCADE ON UPDATE CASCADE;
