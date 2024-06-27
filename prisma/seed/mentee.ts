import { PrismaClient } from '@prisma/client';
import { AKUN_KOSONG, MENTEE_PER_KELOMPOK } from './utils/constant';
import { getRandomFakultasJurusanAngkatan } from './utils/helper';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed mentee...');

  console.log('Menghapus data mentee lama...');
  await prisma.mentee.deleteMany();

  console.log('Menambahkan data mentee...');

  const dataKelompok = await prisma.kelompokOKK.findMany();

  const dataAkunMentee = await prisma.akun.findMany({
    where: {
      AND: AKUN_KOSONG,
    },
    take: MENTEE_PER_KELOMPOK * dataKelompok.length,
  });

  const menteePromises = [];

  for (let i = 0; i < dataAkunMentee.length; i++) {
    const kelompokIndex = Math.floor(i / MENTEE_PER_KELOMPOK);
    const kelompok = dataKelompok[kelompokIndex];

    const dataRandom = getRandomFakultasJurusanAngkatan();

    menteePromises.push(
      await prisma.mentee.upsert({
        where: { username: dataAkunMentee[i].username },
        update: {},
        create: {
          username: dataAkunMentee[i].username,
          fakultas: dataRandom.fakultas,
          jurusan: dataRandom.jurusan,
          angkatan: dataRandom.angkatan,
          noKelompokOKK: kelompok.no,
        },
      }),
    );
  }

  await Promise.all(menteePromises);

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
