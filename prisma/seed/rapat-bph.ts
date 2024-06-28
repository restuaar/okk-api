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

  const rapatBPHPromises = Array.from(
    { length: BANYAK_RAPAT_BPH },
    async () => {
      const divisi = divisiBPH[getRandomInt(divisiBPH.length - 1)];
      const waktu = getRandomWaktu();
      return prisma.rapatBPH.upsert({
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
      });
    },
  );

  const rapatBPH = await Promise.all(rapatBPHPromises);

  console.log('Menjalankan seed anggota rapat BPH...');

  const panitiaRapatPromises = rapatBPH.map(async (rapat) => {
    const panitiaDivisi = await prisma.panitia.findMany({
      where: {
        divisiBPHId: rapat.divisiBPHId,
      },
    });

    return panitiaDivisi.map((panitia) => {
      return prisma.panitiaRapatBPH.upsert({
        where: {
          panitiaUsername_rapatBPHWaktu_rapatBPHDivisiBPHId: {
            panitiaUsername: panitia.username,
            rapatBPHWaktu: rapat.waktu,
            rapatBPHDivisiBPHId: rapat.divisiBPHId,
          },
        },
        update: {},
        create: {
          panitiaUsername: panitia.username,
          waktuHadir: getRandomWaktu(rapat.waktu),
          rapatBPHWaktu: rapat.waktu,
          rapatBPHDivisiBPHId: rapat.divisiBPHId,
        },
      });
    });
  });

  await Promise.all(panitiaRapatPromises);

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
