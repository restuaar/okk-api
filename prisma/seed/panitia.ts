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

  console.log('Menambahkan data panitia PI...');

  const divisiPI = await prisma.divisiPI.findMany();

  const dataAkunPI = await prisma.akun.findMany({
    where: {
      AND: AKUN_KOSONG,
    },
    take: divisiPI.length,
  });

  const panitiaPIPromises = dataAkunPI.map((akun, index) => {
    const dataRandom = getRandomFakultasJurusanAngkatan();
    return prisma.panitia.upsert({
      where: { username: akun.username },
      update: {},
      create: {
        username: akun.username,
        fakultas: dataRandom.fakultas,
        jurusan: dataRandom.jurusan,
        angkatan: dataRandom.angkatan,
        divisi_pi_id: divisiPI[index].id,
        jabatan: TipeJabatan.PENGURUS_INTI,
      },
    });
  });

  await Promise.all(panitiaPIPromises);

  console.log('Menambahkan data panitia BPH...');

  const divisiBPH = await prisma.divisiBPH.findMany();

  const dataAkunBPH = await prisma.akun.findMany({
    where: {
      AND: AKUN_KOSONG,
    },
    take: divisiBPH.length * ANGGOTA_PER_DIVISI,
  });

  const panitiaBPHPromises = dataAkunBPH.map((akun, index) => {
    const divisi = divisiBPH[Math.floor(index / ANGGOTA_PER_DIVISI)];

    const dataRandom = getRandomFakultasJurusanAngkatan();

    return prisma.panitia.upsert({
      where: { username: akun.username },
      update: {},
      create: {
        username: akun.username,
        fakultas: dataRandom.fakultas,
        jurusan: dataRandom.jurusan,
        angkatan: dataRandom.angkatan,
        divisi_bph_id: divisi.id,
        jabatan: getJabatanByIndex(index),
      },
    });
  });

  await Promise.all(panitiaBPHPromises);

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
