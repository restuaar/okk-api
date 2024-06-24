-- CreateEnum
CREATE TYPE "tipe_jabatan" AS ENUM ('PENGURUS_INTI', 'PJ', 'WA_PJ1', 'WA_PJ2', 'STAFF');

-- CreateEnum
CREATE TYPE "paket_sponsor" AS ENUM ('GOLD', 'SILVER', 'BRONZE');

-- CreateTable
CREATE TABLE "akun" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "akun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panitia" (
    "username" TEXT NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "fakultas" VARCHAR(50) NOT NULL,
    "jurusan" VARCHAR(50) NOT NULL,
    "angkatan" SMALLINT NOT NULL,
    "divisiPIId" TEXT,
    "divisiBPHId" TEXT,
    "jabatan" "tipe_jabatan" NOT NULL DEFAULT 'STAFF',

    CONSTRAINT "panitia_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "divisi_PI" (
    "id" TEXT NOT NULL,
    "nama" VARCHAR(50) NOT NULL,

    CONSTRAINT "divisi_PI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divisi_bph" (
    "id" TEXT NOT NULL,
    "nama" VARCHAR(50) NOT NULL,

    CONSTRAINT "divisi_bph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rapat_bph" (
    "waktu" TIMESTAMP NOT NULL,
    "tempat" VARCHAR(255) NOT NULL,
    "kesimpulan" TEXT NOT NULL,
    "divisiBPHId" TEXT NOT NULL,

    CONSTRAINT "rapat_bph_pkey" PRIMARY KEY ("divisiBPHId","waktu")
);

-- CreateTable
CREATE TABLE "panitia_rapat_bph" (
    "panitiaUsername" VARCHAR(100) NOT NULL,
    "waktuHadir" TIMESTAMP NOT NULL,
    "rapatBPHWaktu" TIMESTAMP NOT NULL,
    "rapatBPHDivisiBPHId" TEXT NOT NULL,

    CONSTRAINT "panitia_rapat_bph_pkey" PRIMARY KEY ("panitiaUsername","rapatBPHWaktu","rapatBPHDivisiBPHId")
);

-- CreateTable
CREATE TABLE "kelompok_okk" (
    "id" TEXT NOT NULL,
    "no" SMALLINT NOT NULL,
    "usernameMentor" TEXT NOT NULL,

    CONSTRAINT "kelompok_okk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentee" (
    "username" TEXT NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "fakultas" VARCHAR(50) NOT NULL,
    "jurusan" VARCHAR(50) NOT NULL,
    "angkatan" SMALLINT NOT NULL,
    "noKelompokOKK" SMALLINT NOT NULL,

    CONSTRAINT "mentee_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "mentoring" (
    "waktu" TIMESTAMP NOT NULL,
    "tempat" VARCHAR(255) NOT NULL,
    "materi" TEXT NOT NULL,
    "noKelompokOKK" SMALLINT NOT NULL,

    CONSTRAINT "mentoring_pkey" PRIMARY KEY ("noKelompokOKK","waktu")
);

-- CreateTable
CREATE TABLE "mentee_mentoring" (
    "menteeUsername" VARCHAR(100) NOT NULL,
    "waktuHadir" TIMESTAMP NOT NULL,
    "mentoringWaktu" TIMESTAMP NOT NULL,
    "mentoringNoKelompokOKK" INTEGER NOT NULL,

    CONSTRAINT "mentee_mentoring_pkey" PRIMARY KEY ("menteeUsername","mentoringWaktu","mentoringNoKelompokOKK")
);

-- CreateTable
CREATE TABLE "acara" (
    "id" TEXT NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "waktuMulai" TIMESTAMP NOT NULL,
    "waktuSelesai" TIMESTAMP NOT NULL,
    "tempat" VARCHAR(255) NOT NULL,
    "tanggal" DATE NOT NULL,

    CONSTRAINT "acara_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsor" (
    "username" VARCHAR(100) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "kontak" VARCHAR(100) NOT NULL,

    CONSTRAINT "sponsor_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "acara_sponsor" (
    "acaraId" TEXT NOT NULL,
    "sponsorId" VARCHAR(100) NOT NULL,
    "paket" "paket_sponsor" NOT NULL,

    CONSTRAINT "acara_sponsor_pkey" PRIMARY KEY ("acaraId","sponsorId")
);

-- CreateTable
CREATE TABLE "pembicara" (
    "username" VARCHAR(100) NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "kontak" VARCHAR(100) NOT NULL,

    CONSTRAINT "pembicara_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "acara_pembicara" (
    "acaraId" TEXT NOT NULL,
    "pembicaraId" VARCHAR(100) NOT NULL,

    CONSTRAINT "acara_pembicara_pkey" PRIMARY KEY ("acaraId","pembicaraId")
);

-- CreateIndex
CREATE UNIQUE INDEX "akun_username_key" ON "akun"("username");

-- CreateIndex
CREATE UNIQUE INDEX "panitia_divisiPIId_key" ON "panitia"("divisiPIId");

-- CreateIndex
CREATE UNIQUE INDEX "divisi_PI_nama_key" ON "divisi_PI"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "divisi_bph_nama_key" ON "divisi_bph"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "kelompok_okk_no_key" ON "kelompok_okk"("no");

-- CreateIndex
CREATE UNIQUE INDEX "kelompok_okk_usernameMentor_key" ON "kelompok_okk"("usernameMentor");

-- AddForeignKey
ALTER TABLE "panitia" ADD CONSTRAINT "panitia_username_fkey" FOREIGN KEY ("username") REFERENCES "akun"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia" ADD CONSTRAINT "panitia_divisiPIId_fkey" FOREIGN KEY ("divisiPIId") REFERENCES "divisi_PI"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia" ADD CONSTRAINT "panitia_divisiBPHId_fkey" FOREIGN KEY ("divisiBPHId") REFERENCES "divisi_bph"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rapat_bph" ADD CONSTRAINT "rapat_bph_divisiBPHId_fkey" FOREIGN KEY ("divisiBPHId") REFERENCES "divisi_bph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia_rapat_bph" ADD CONSTRAINT "panitia_rapat_bph_panitiaUsername_fkey" FOREIGN KEY ("panitiaUsername") REFERENCES "panitia"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panitia_rapat_bph" ADD CONSTRAINT "panitia_rapat_bph_rapatBPHWaktu_rapatBPHDivisiBPHId_fkey" FOREIGN KEY ("rapatBPHWaktu", "rapatBPHDivisiBPHId") REFERENCES "rapat_bph"("waktu", "divisiBPHId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok_okk" ADD CONSTRAINT "kelompok_okk_usernameMentor_fkey" FOREIGN KEY ("usernameMentor") REFERENCES "panitia"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee" ADD CONSTRAINT "mentee_username_fkey" FOREIGN KEY ("username") REFERENCES "akun"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee" ADD CONSTRAINT "mentee_noKelompokOKK_fkey" FOREIGN KEY ("noKelompokOKK") REFERENCES "kelompok_okk"("no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentoring" ADD CONSTRAINT "mentoring_noKelompokOKK_fkey" FOREIGN KEY ("noKelompokOKK") REFERENCES "kelompok_okk"("no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_mentoring" ADD CONSTRAINT "mentee_mentoring_menteeUsername_fkey" FOREIGN KEY ("menteeUsername") REFERENCES "mentee"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_mentoring" ADD CONSTRAINT "mentee_mentoring_mentoringWaktu_mentoringNoKelompokOKK_fkey" FOREIGN KEY ("mentoringWaktu", "mentoringNoKelompokOKK") REFERENCES "mentoring"("waktu", "noKelompokOKK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor" ADD CONSTRAINT "sponsor_username_fkey" FOREIGN KEY ("username") REFERENCES "akun"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_sponsor" ADD CONSTRAINT "acara_sponsor_acaraId_fkey" FOREIGN KEY ("acaraId") REFERENCES "acara"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_sponsor" ADD CONSTRAINT "acara_sponsor_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "sponsor"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembicara" ADD CONSTRAINT "pembicara_username_fkey" FOREIGN KEY ("username") REFERENCES "akun"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_pembicara" ADD CONSTRAINT "acara_pembicara_acaraId_fkey" FOREIGN KEY ("acaraId") REFERENCES "acara"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara_pembicara" ADD CONSTRAINT "acara_pembicara_pembicaraId_fkey" FOREIGN KEY ("pembicaraId") REFERENCES "pembicara"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
