import { PrismaClient } from '@prisma/client';
import { BANYAK_RAPAT_BPH } from './utils/constant';
import {
  getRandomInt,
  getRandomKalimat,
  getRandomTempat,
  getRandomWaktu,
} from './utils/helper';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed rapat BPH...');

  console.log('Menghapus data rapat BPH lama...');
  await prisma.panitiaRapatBPH.deleteMany();
  await prisma.rapatBPH.deleteMany();

  console.log('Menambahkan data rapat BPH...');

  const divisiBPH = await prisma.divisiBPH.findMany();

  const rapatBPHPromises = [];
  for (let i = 0; i < BANYAK_RAPAT_BPH; i++) {
    const divisi = divisiBPH[getRandomInt(divisiBPH.length - 1)];
    const waktu = getRandomWaktu();
    rapatBPHPromises.push(
      await prisma.rapatBPH.upsert({
        where: {
          divisiBPHId_waktu: {
            divisiBPHId: divisi.id,
            waktu: waktu,
          },
        },
        update: {},
        create: {
          waktu: waktu,
          tempat: getRandomTempat(),
          kesimpulan: getRandomKalimat(),
          divisiBPHId: divisi.id,
        },
      }),
    );

    const panitia = await prisma.panitia.findMany({
      where: {
        divisiBPHId: divisi.id,
      },
    });

    const kehadiranRapatBPHPromises = [];
    for (let j = 0; j < panitia.length; j++) {
      kehadiranRapatBPHPromises.push(
        await prisma.panitiaRapatBPH.upsert({
          where: {
            panitiaUsername_rapatBPHWaktu_rapatBPHDivisiBPHId: {
              panitiaUsername: panitia[j].username,
              rapatBPHWaktu: waktu,
              rapatBPHDivisiBPHId: divisi.id,
            },
          },
          update: {},
          create: {
            panitiaUsername: panitia[j].username,
            waktuHadir: getRandomWaktu(waktu),
            rapatBPHWaktu: waktu,
            rapatBPHDivisiBPHId: divisi.id,
          },
        }),
      );
    }
    await Promise.all(kehadiranRapatBPHPromises);
  }

  await Promise.all(rapatBPHPromises);

  console.log('Seed rapat BPH berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
