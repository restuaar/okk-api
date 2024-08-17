import { PrismaClient, TipeJabatan } from '@prisma/client';
import { AKUN_KOSONG, ANGGOTA_PER_DIVISI } from './utils/constant';
import {
  getJabatanByIndex,
  getRandomFakultasJurusanAngkatan,
} from './utils/helper';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed panitia...');

  console.log('Menghapus data panitia lama...');
  await prisma.panitia.deleteMany();

  console.log('Menambahkan data panitia PI baru...');
  const divisiPI = await prisma.divisiPI.findMany();
  const dataAkunPI = await prisma.akun.findMany({
    where: {
      AND: AKUN_KOSONG,
    },
    take: divisiPI.length - 1,
  });

  const panitiaPIRecords = dataAkunPI.map((akun, index) => {
    const dataRandom = getRandomFakultasJurusanAngkatan();
    return {
      username: index === 0 ? 'restuaar' : akun.username,
      fakultas: dataRandom.fakultas,
      jurusan: dataRandom.jurusan,
      angkatan: dataRandom.angkatan,
      divisi_pi_id: divisiPI[index].id,
      jabatan: TipeJabatan.PENGURUS_INTI,
    };
  });

  await prisma.panitia.createMany({
    data: panitiaPIRecords,
  });

  console.log('Menambahkan data panitia BPH baru...');
  const divisiBPH = await prisma.divisiBPH.findMany();
  const dataAkunBPH = await prisma.akun.findMany({
    where: {
      AND: AKUN_KOSONG,
    },
    take: divisiBPH.length * ANGGOTA_PER_DIVISI,
  });

  const panitiaBPHRecords = dataAkunBPH.map((akun, index) => {
    const divisi = divisiBPH[Math.floor(index / ANGGOTA_PER_DIVISI)];
    const dataRandom = getRandomFakultasJurusanAngkatan();

    return {
      username: akun.username,
      fakultas: dataRandom.fakultas,
      jurusan: dataRandom.jurusan,
      angkatan: dataRandom.angkatan,
      divisi_bph_id: divisi.id,
      jabatan: getJabatanByIndex(index),
    };
  });

  await prisma.panitia.createMany({
    data: panitiaBPHRecords,
  });

  console.log('Seed panitia berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
