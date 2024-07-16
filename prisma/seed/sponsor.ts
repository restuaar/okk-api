import { PrismaClient } from '@prisma/client';
import {
  AKUN_KOSONG,
  BANYAK_SPONSOR,
  SPONSOR_PER_ACARA,
} from './utils/constant';
import {
  getPaketRandom,
  getRandomCompanyName,
  getRandomInt,
  getRandomKontak,
  usernameFromCompany,
} from './utils/helper';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed sponsor...');

  await prisma.acaraSponsor.deleteMany();
  await prisma.sponsor.deleteMany();

  const acara = await prisma.acara.findMany();

  let dataAkunSponsor = await prisma.akun.findMany({
    where: {
      AND: AKUN_KOSONG,
    },
    take: BANYAK_SPONSOR,
  });

  const updatedAkunPromises = dataAkunSponsor.map((akun) => {
    const namaSponsor = getRandomCompanyName();
    return prisma.akun.update({
      where: { username: akun.username },
      data: {
        username: usernameFromCompany(namaSponsor),
        nama: namaSponsor,
      },
    });
  });

  dataAkunSponsor = await Promise.all(updatedAkunPromises);

  const sponsorRecords = dataAkunSponsor.map((akun) => ({
    username: akun.username,
    kontak: getRandomKontak(),
  }));

  await prisma.sponsor.createMany({
    data: sponsorRecords,
  });

  const acaraSponsorRecords = acara.flatMap((acaraItem) => {
    const randomBanyakSponsor = getRandomInt(SPONSOR_PER_ACARA, 1);
    const sponsorIndex = new Set();

    return Array.from({ length: randomBanyakSponsor }, () => {
      let randomSponsorIndex = getRandomInt(BANYAK_SPONSOR - 1);
      while (sponsorIndex.has(randomSponsorIndex)) {
        randomSponsorIndex = getRandomInt(BANYAK_SPONSOR - 1);
      }
      sponsorIndex.add(randomSponsorIndex);
      const sponsor = dataAkunSponsor[randomSponsorIndex];

      return {
        id_acara: acaraItem.id,
        id_sponsor: sponsor.username,
        paket: getPaketRandom(),
      };
    });
  });

  await prisma.acaraSponsor.createMany({
    data: acaraSponsorRecords,
  });

  console.log('Seed sponsor berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
