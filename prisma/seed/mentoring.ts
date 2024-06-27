import { PrismaClient } from '@prisma/client';
import { MENTORING_PER_KELOMPOK } from './utils/constant';
import {
  getRandomMateri,
  getRandomTempat,
  getRandomWaktu,
} from './utils/helper';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed mentoring...');

  console.log('Menghapus data mentoring lama...');
  await prisma.menteeMentoring.deleteMany();
  await prisma.mentoring.deleteMany();

  console.log('Menambahkan data mentoring...');

  const kelompokOKK = await prisma.kelompokOKK.findMany();

  for (let i = 0; i < kelompokOKK.length; i++) {
    const kelompok = kelompokOKK[i];
    for (let i = 0; i < MENTORING_PER_KELOMPOK; i++) {
      const waktu = getRandomWaktu();

      await prisma.mentoring.upsert({
        where: {
          noKelompokOKK_waktu: {
            noKelompokOKK: kelompok.no,
            waktu: waktu,
          },
        },
        update: {},
        create: {
          waktu: waktu,
          tempat: getRandomTempat(),
          materi: getRandomMateri(),
          noKelompokOKK: kelompok.no,
        },
      });

      const mentees = await prisma.mentee.findMany({
        where: {
          noKelompokOKK: kelompok.no,
        },
      });

      for (let j = 0; j < mentees.length; j++) {
        await prisma.menteeMentoring.upsert({
          where: {
            menteeUsername_mentoringWaktu_mentoringNoKelompokOKK: {
              menteeUsername: mentees[j].username,
              mentoringWaktu: waktu,
              mentoringNoKelompokOKK: kelompok.no,
            },
          },
          update: {},
          create: {
            menteeUsername: mentees[j].username,
            waktuHadir: getRandomWaktu(waktu),
            mentoringWaktu: waktu,
            mentoringNoKelompokOKK: kelompok.no,
          },
        });
      }
    }
  }

  console.log('Seed mentoring berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
