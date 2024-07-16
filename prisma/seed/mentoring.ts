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

  const mentoringData = kelompokOKK.flatMap((kelompok) =>
    Array.from({ length: MENTORING_PER_KELOMPOK }).map(() => {
      const waktu = getRandomWaktu();
      return {
        waktu,
        tempat: getRandomTempat(),
        materi: getRandomMateri(),
        no_kelompok: kelompok.no,
      };
    }),
  );

  await prisma.mentoring.createMany({
    data: mentoringData,
  });

  console.log('Menambahkan data mentee mentoring...');

  const menteeMentoringData = (
    await Promise.all(
      mentoringData.map(async (mentoring) => {
        const mentees = await prisma.mentee.findMany({
          where: { no_kelompok_okk: mentoring.no_kelompok },
        });

        return mentees.map((mentee) => ({
          mentee_username: mentee.username,
          waktu_hadir: getRandomWaktu(mentoring.waktu),
          waktu_mentoring: mentoring.waktu,
          no_kelompok: mentoring.no_kelompok,
        }));
      }),
    )
  ).flat();

  await prisma.menteeMentoring.createMany({
    data: menteeMentoringData,
  });

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
