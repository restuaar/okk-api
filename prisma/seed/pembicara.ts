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

  console.log('Menghapus data pembicara lama...');
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

  const pembicaraPromises = dataAkunPembicara.map(async (akun) => {
    return prisma.pembicara.upsert({
      where: { username: akun.username },
      update: {},
      create: {
        username: akun.username,
        kontak: getRandomKontak(),
      },
    });
  });

  await Promise.all(pembicaraPromises);

  const acaraPembicaraPromises = acara.map((acara) => {
    const randomBanyakPembicara = getRandomInt(PEMBICARA_PER_ACARA, 1);
    const pembicaraIndex = [];

    return Array.from({ length: randomBanyakPembicara }, () => {
      let randomPembicaraIndex = getRandomInt(BANYAK_PEMBICARA - 1);
      while (pembicaraIndex.includes(randomPembicaraIndex)) {
        randomPembicaraIndex = getRandomInt(BANYAK_PEMBICARA - 1);
      }
      pembicaraIndex.push(randomPembicaraIndex);
      const pembicara = dataAkunPembicara[randomPembicaraIndex];

      return prisma.acaraPembicara.upsert({
        where: {
          acaraId_pembicaraId: {
            acaraId: acara.id,
            pembicaraId: pembicara.username,
          },
        },
        update: {},
        create: {
          acaraId: acara.id,
          pembicaraId: pembicara.username,
        },
      });
    });
  });

  await Promise.all(
    acaraPembicaraPromises.map((promises) => Promise.all(promises)),
  );

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
