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
          divisi_bph_id_waktu: {
            divisi_bph_id: divisi.id,
            waktu: waktu,
          },
        },
        update: {},
        create: {
          waktu: waktu,
          tempat: getRandomTempat(),
          kesimpulan: getRandomKalimat(),
          divisi_bph_id: divisi.id,
        },
      });
    },
  );

  const rapatBPH = await Promise.all(rapatBPHPromises);

  console.log('Menjalankan seed anggota rapat BPH...');

  for (const rapat of rapatBPH) {
    const panitiaDivisi = await prisma.panitia.findMany({
      where: {
        divisi_bph_id: rapat.divisi_bph_id,
      },
    });

    const panitiaPromise = panitiaDivisi.map((panitia) => {
      return prisma.panitiaRapatBPH.upsert({
        where: {
          panitia_username_waktu_rapat_divisi_bph_id: {
            panitia_username: panitia.username,
            waktu_rapat: rapat.waktu,
            divisi_bph_id: rapat.divisi_bph_id,
          },
        },
        update: {},
        create: {
          panitia_username: panitia.username,
          waktu_hadir: getRandomWaktu(rapat.waktu),
          waktu_rapat: rapat.waktu,
          divisi_bph_id: rapat.divisi_bph_id,
        },
      });
    });

    await Promise.all(panitiaPromise);
  }

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
