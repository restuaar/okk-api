import { PrismaClient } from '@prisma/client';
import { AKUN_KOSONG, MENTEE_PER_KELOMPOK } from './utils/constant';
import { getRandomFakultasJurusanAngkatan } from './utils/helper';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed mentee...');

  await prisma.mentee.deleteMany();

  console.log('Menambahkan data mentee...');

  const dataKelompok = await prisma.kelompokOKK.findMany();

  const dataAkunMentee = await prisma.akun.findMany({
    where: {
      AND: AKUN_KOSONG,
    },
    take: MENTEE_PER_KELOMPOK * dataKelompok.length,
  });

  const menteeRecords = dataAkunMentee.map((akun, index) => {
    const kelompok = dataKelompok[Math.floor(index / MENTEE_PER_KELOMPOK)];
    const dataRandom = getRandomFakultasJurusanAngkatan();

    return {
      username: akun.username,
      fakultas: dataRandom.fakultas,
      jurusan: dataRandom.jurusan,
      angkatan: dataRandom.angkatan,
      no_kelompok_okk: kelompok.no,
    };
  });

  await prisma.mentee.createMany({
    data: menteeRecords,
  });

  console.log('Seed mentee berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
