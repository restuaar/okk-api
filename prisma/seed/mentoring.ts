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
          no_kelompok_waktu: {
            no_kelompok: kelompok.no,
            waktu: waktu,
          },
        },
        update: {},
        create: {
          waktu: waktu,
          tempat: getRandomTempat(),
          materi: getRandomMateri(),
          no_kelompok: kelompok.no,
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
            no_kelompok_okk: mentoring.no_kelompok,
          },
        });

        return mentee.map(async (mentee) => {
          return prisma.menteeMentoring.upsert({
            where: {
              mentee_username_waktu_mentoring_no_kelompok: {
                mentee_username: mentee.username,
                waktu_mentoring: mentoring.waktu,
                no_kelompok: mentoring.no_kelompok,
              },
            },
            update: {},
            create: {
              mentee_username: mentee.username,
              waktu_hadir: getRandomWaktu(mentoring.waktu),
              waktu_mentoring: mentoring.waktu,
              no_kelompok: mentoring.no_kelompok,
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
