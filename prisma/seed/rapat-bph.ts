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

  const rapatBPHRecords = Array.from({ length: BANYAK_RAPAT_BPH }, () => {
    const divisi = divisiBPH[getRandomInt(divisiBPH.length - 1)];
    const waktu = getRandomWaktu();
    return {
      waktu: waktu,
      tempat: getRandomTempat(),
      kesimpulan: getRandomKalimat(),
      divisi_bph_id: divisi.id,
    };
  });

  await prisma.rapatBPH.createMany({
    data: rapatBPHRecords,
  });

  console.log('Menambahkan anggota rapat BPH...');

  const panitiaPromises = rapatBPHRecords.map(async (rapat) => {
    const panitiaDivisi = await prisma.panitia.findMany({
      where: {
        divisi_bph_id: rapat.divisi_bph_id,
      },
    });

    return panitiaDivisi.map((panitia) => ({
      panitia_username: panitia.username,
      waktu_hadir: getRandomWaktu(rapat.waktu),
      waktu_rapat: rapat.waktu,
      divisi_bph_id: rapat.divisi_bph_id,
    }));
  });

  const panitiaRapatBPHRecords = (await Promise.all(panitiaPromises)).flat();

  await prisma.panitiaRapatBPH.createMany({
    data: panitiaRapatBPHRecords,
  });

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
