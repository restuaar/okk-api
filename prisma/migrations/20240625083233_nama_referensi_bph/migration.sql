-- DropForeignKey
ALTER TABLE "divisi_bph" DROP CONSTRAINT "divisi_bph_divisiBagian_fkey";

-- AddForeignKey
ALTER TABLE "divisi_bph" ADD CONSTRAINT "divisi_bph_divisiBagian_fkey" FOREIGN KEY ("divisiBagian") REFERENCES "divisi_PI"("nama") ON DELETE RESTRICT ON UPDATE CASCADE;
