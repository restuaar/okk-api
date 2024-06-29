/*
  Warnings:

  - You are about to drop the `divisi_PI` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "divisi_bph" DROP CONSTRAINT "divisi_bph_divisiBagian_fkey";

-- DropForeignKey
ALTER TABLE "panitia" DROP CONSTRAINT "panitia_divisiPIId_fkey";

-- DropTable
DROP TABLE "divisi_PI";

-- CreateTable
CREATE TABLE "divisi_pi" (
    "id" TEXT NOT NULL,
    "nama" VARCHAR(50) NOT NULL,

    CONSTRAINT "divisi_pi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "divisi_pi_nama_key" ON "divisi_pi"("nama");

-- AddForeignKey
ALTER TABLE "panitia" ADD CONSTRAINT "panitia_divisiPIId_fkey" FOREIGN KEY ("divisiPIId") REFERENCES "divisi_pi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divisi_bph" ADD CONSTRAINT "divisi_bph_divisiBagian_fkey" FOREIGN KEY ("divisiBagian") REFERENCES "divisi_pi"("nama") ON DELETE RESTRICT ON UPDATE CASCADE;
