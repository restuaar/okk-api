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

  const mentoringPromises = kelompokOKK.map((kelompok) => {
    return Array.from({ length: MENTORING_PER_KELOMPOK }, async () => {
      const waktu = getRandomWaktu();
      return prisma.mentoring.upsert({
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
    });
  });

  const mentoringPerKelompok = await Promise.all(
    mentoringPromises.map((promise) => Promise.all(promise)),
  );

  const mentoringMenteePromises = mentoringPerKelompok.map(
    async (mentoringKelompok) => {
      return mentoringKelompok.map(async (mentoring) => {
        const mentee = await prisma.mentee.findMany({
          where: {
            noKelompokOKK: mentoring.noKelompokOKK,
          },
        });

        return mentee.map(async (mentee) => {
          return prisma.menteeMentoring.upsert({
            where: {
              menteeUsername_mentoringWaktu_mentoringNoKelompokOKK: {
                menteeUsername: mentee.username,
                mentoringWaktu: mentoring.waktu,
                mentoringNoKelompokOKK: mentoring.noKelompokOKK,
              },
            },
            update: {},
            create: {
              menteeUsername: mentee.username,
              waktuHadir: getRandomWaktu(mentoring.waktu),
              mentoringWaktu: mentoring.waktu,
              mentoringNoKelompokOKK: mentoring.noKelompokOKK,
            },
          });
        });
      });
    },
  );

  await Promise.all(mentoringMenteePromises);

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
