import { PrismaClient } from '@prisma/client';
import {
  AKUN_KOSONG,
  BANYAK_PEMBICARA,
  PEMBICARA_PER_ACARA,
} from './utils/constant';
import { getRandomInt, getRandomKontak } from './utils/helper';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed pembicara...');

  await prisma.acaraPembicara.deleteMany();
  await prisma.pembicara.deleteMany();

  console.log('Menambahkan data pembicara...');

  const acara = await prisma.acara.findMany();

  const dataAkunPembicara = await prisma.akun.findMany({
    where: {
      AND: AKUN_KOSONG,
    },
    take: BANYAK_PEMBICARA,
  });

  const pembicaraRecords = dataAkunPembicara.map((akun) => ({
    username: akun.username,
    kontak: getRandomKontak(),
  }));

  await prisma.pembicara.createMany({
    data: pembicaraRecords,
  });

  const acaraPembicaraRecords = acara.flatMap((acaraItem) => {
    const randomBanyakPembicara = getRandomInt(PEMBICARA_PER_ACARA, 1);
    const pembicaraIndex = new Set();

    return Array.from({ length: randomBanyakPembicara }, () => {
      let randomPembicaraIndex = getRandomInt(BANYAK_PEMBICARA - 1);
      while (pembicaraIndex.has(randomPembicaraIndex)) {
        randomPembicaraIndex = getRandomInt(BANYAK_PEMBICARA - 1);
      }
      pembicaraIndex.add(randomPembicaraIndex);
      const pembicara = dataAkunPembicara[randomPembicaraIndex];

      return {
        id_acara: acaraItem.id,
        id_pembicara: pembicara.username,
      };
    });
  });

  await prisma.acaraPembicara.createMany({
    data: acaraPembicaraRecords,
  });

  console.log('Seed pembicara berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
