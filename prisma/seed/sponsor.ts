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

  console.log('Menghapus data sponsor lama...');
  await prisma.acaraSponsor.deleteMany();
  await prisma.sponsor.deleteMany();

  console.log('Menambahkan data sponsor...');

  const acara = await prisma.acara.findMany();

  let dataAkunSponsor = await prisma.akun.findMany({
    where: {
      AND: AKUN_KOSONG,
    },
    take: BANYAK_SPONSOR,
  });

  console.log('Update akun sponsor...');

  const updateAkun = dataAkunSponsor.map((akun) => {
    const namaSponsor = getRandomCompanyName();
    return prisma.akun.update({
      where: { username: akun.username },
      data: {
        username: usernameFromCompany(namaSponsor),
        nama: namaSponsor,
      },
    });
  });

  dataAkunSponsor = await Promise.all(updateAkun);

  const sponsorPromises = dataAkunSponsor.map(async (akun) => {
    return prisma.sponsor.upsert({
      where: { username: akun.username },
      update: {},
      create: {
        username: akun.username,
        kontak: getRandomKontak(),
      },
    });
  });

  await Promise.all(sponsorPromises);

  const acaraSponsorPromises = acara.map(async (acara) => {
    const randomBanyakSponsor = getRandomInt(SPONSOR_PER_ACARA, 1);
    const sponsorIndex = [];

    return Array.from({ length: randomBanyakSponsor }, async () => {
      let randomSponsorIndex = getRandomInt(BANYAK_SPONSOR - 1);
      while (sponsorIndex.includes(randomSponsorIndex)) {
        randomSponsorIndex = getRandomInt(BANYAK_SPONSOR - 1);
      }
      sponsorIndex.push(randomSponsorIndex);
      const sponsor = dataAkunSponsor[randomSponsorIndex];

      await prisma.acaraSponsor.upsert({
        where: {
          acaraId_sponsorId: {
            acaraId: acara.id,
            sponsorId: sponsor.username,
          },
        },
        update: {},
        create: {
          acaraId: acara.id,
          sponsorId: sponsor.username,
          paket: getPaketRandom(),
        },
      });
    });
  });

  await Promise.all(acaraSponsorPromises);

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
