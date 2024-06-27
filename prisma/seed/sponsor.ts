import { PrismaClient } from '@prisma/client';
import { AKUN_KOSONG, BANYAK_SPONSOR } from './utils/constant';
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
  const updateAkun = [];
  for (let i = 0; i < BANYAK_SPONSOR; i++) {
    const sponsor = dataAkunSponsor[i];
    const nameSponsor = getRandomCompanyName();
    updateAkun.push(
      await prisma.akun.update({
        where: { username: sponsor.username },
        data: {
          username: usernameFromCompany(nameSponsor),
          nama: nameSponsor,
        },
      }),
    );
  }

  dataAkunSponsor = await Promise.all(updateAkun);

  const sponsorPromises = dataAkunSponsor.map(async (akun) => {
    return await prisma.sponsor.upsert({
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
    const randomBanyakSponsor = getRandomInt(4, 1);
    const sponsorIndex = [];

    for (let i = 0; i < randomBanyakSponsor; i++) {
      let randomSponsorIndex = getRandomInt(BANYAK_SPONSOR - 1, 0);
      while (sponsorIndex.includes(randomSponsorIndex)) {
        randomSponsorIndex = getRandomInt(BANYAK_SPONSOR - 1, 0);
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
    }
    sponsorIndex.length = 0;
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
