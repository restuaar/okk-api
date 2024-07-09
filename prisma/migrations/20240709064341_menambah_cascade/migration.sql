-- DropForeignKey
ALTER TABLE "acara_pembicara" DROP CONSTRAINT "acara_pembicara_id_acara_fkey";

-- DropForeignKey
ALTER TABLE "acara_pembicara" DROP CONSTRAINT "acara_pembicara_id_pembicara_fkey";

-- DropForeignKey
ALTER TABLE "acara_sponsor" DROP CONSTRAINT "acara_sponsor_id_acara_fkey";

-- DropForeignKey
ALTER TABLE "acara_sponsor" DROP CONSTRAINT "acara_sponsor_id_sponsor_fkey";

-- DropForeignKey
ALTER TABLE "divisi_bph" DROP CONSTRAINT "divisi_bph_divisi_bagian_fkey";

-- DropForeignKey
ALTER TABLE "kelompok_okk" DROP CONSTRAINT "kelompok_okk_username_mentor_fkey";

-- DropForeignKey
ALTER TABLE "mentee" DROP CONSTRAINT "mentee_no_kelompok_okk_fkey";

-- DropForeignKey
ALTER TABLE "mentee" DROP CONSTRAINT "mentee_username_fkey";

-- DropForeignKey
ALTER TABLE "mentee_mentoring" DROP CONSTRAINT "mentee_mentoring_mentee_username_fkey";

-- DropForeignKey
ALTER TABLE "mentee_mentoring" DROP CONSTRAINT "mentee_mentoring_waktu_mentoring_no_kelompok_fkey";

-- DropForeignKey
ALTER TABLE "mentoring" DROP CONSTRAINT "mentoring_no_kelompok_fkey";

-- DropForeignKey
ALTER TABLE "panitia" DROP CONSTRAINT "panitia_divisi_bph_id_fkey";

-- DropForeignKey
ALTER TABLE "panitia" DROP CONSTRAINT "panitia_divisi_pi_id_fkey";

-- DropForeignKey
ALTER TABLE "panitia" DROP CONSTRAINT "panitia_username_fkey";

-- DropForeignKey
ALTER TABLE "panitia_rapat_bph" DROP CONSTRAINT "panitia_rapat_bph_panitia_username_fkey";

-- DropForeignKey
ALTER TABLE "panitia_rapat_bph" DROP CONSTRAINT "panitia_rapat_bph_waktu_rapat_divisi_bph_id_fkey";

-- DropForeignKey
ALTER TABLE "pembicara" DROP CONSTRAINT "pembicara_username_fkey";

-- DropForeignKey
ALTER TABLE "rapat_bph" DROP CONSTRAINT "rapat_bph_divisi_bph_id_fkey";

-- DropForeignKey
ALTER TABLE "sponsor" DROP CONSTRAINT "sponsor_username_fkey";

-- AddForeignKey
ALTER TABLE "panitia" ADD CONSTRAINT "panitia_username_fkey" FOREIGN KEY ("username") REFERENCES "akun"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia" ADD CONSTRAINT "panitia_divisi_pi_id_fkey" FOREIGN KEY ("divisi_pi_id") REFERENCES "divisi_pi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia" ADD CONSTRAINT "panitia_divisi_bph_id_fkey" FOREIGN KEY ("divisi_bph_id") REFERENCES "divisi_bph"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divisi_bph" ADD CONSTRAINT "divisi_bph_divisi_bagian_fkey" FOREIGN KEY ("divisi_bagian") REFERENCES "divisi_pi"("nama") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rapat_bph" ADD CONSTRAINT "rapat_bph_divisi_bph_id_fkey" FOREIGN KEY ("divisi_bph_id") REFERENCES "divisi_bph"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia_rapat_bph" ADD CONSTRAINT "panitia_rapat_bph_panitia_username_fkey" FOREIGN KEY ("panitia_username") REFERENCES "panitia"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia_rapat_bph" ADD CONSTRAINT "panitia_rapat_bph_waktu_rapat_divisi_bph_id_fkey" FOREIGN KEY ("waktu_rapat", "divisi_bph_id") REFERENCES "rapat_bph"("waktu", "divisi_bph_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok_okk" ADD CONSTRAINT "kelompok_okk_username_mentor_fkey" FOREIGN KEY ("username_mentor") REFERENCES "panitia"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee" ADD CONSTRAINT "mentee_username_fkey" FOREIGN KEY ("username") REFERENCES "akun"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee" ADD CONSTRAINT "mentee_no_kelompok_okk_fkey" FOREIGN KEY ("no_kelompok_okk") REFERENCES "kelompok_okk"("no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentoring" ADD CONSTRAINT "mentoring_no_kelompok_fkey" FOREIGN KEY ("no_kelompok") REFERENCES "kelompok_okk"("no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_mentoring" ADD CONSTRAINT "mentee_mentoring_mentee_username_fkey" FOREIGN KEY ("mentee_username") REFERENCES "mentee"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_mentoring" ADD CONSTRAINT "mentee_mentoring_waktu_mentoring_no_kelompok_fkey" FOREIGN KEY ("waktu_mentoring", "no_kelompok") REFERENCES "mentoring"("waktu", "no_kelompok") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor" ADD CONSTRAINT "sponsor_username_fkey" FOREIGN KEY ("username") REFERENCES "akun"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_sponsor" ADD CONSTRAINT "acara_sponsor_id_acara_fkey" FOREIGN KEY ("id_acara") REFERENCES "acara"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_sponsor" ADD CONSTRAINT "acara_sponsor_id_sponsor_fkey" FOREIGN KEY ("id_sponsor") REFERENCES "sponsor"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembicara" ADD CONSTRAINT "pembicara_username_fkey" FOREIGN KEY ("username") REFERENCES "akun"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_pembicara" ADD CONSTRAINT "acara_pembicara_id_acara_fkey" FOREIGN KEY ("id_acara") REFERENCES "acara"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_pembicara" ADD CONSTRAINT "acara_pembicara_id_pembicara_fkey" FOREIGN KEY ("id_pembicara") REFERENCES "pembicara"("username") ON DELETE CASCADE ON UPDATE CASCADE;
