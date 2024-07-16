import { PrismaClient } from '@prisma/client';
import { v6 as uuidv6 } from 'uuid';
import { DIVISI } from './utils/constant';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed divisi...');

  console.log('Menghapus data divisi lama...');
  await prisma.divisiBPH.deleteMany();
  await prisma.divisiPI.deleteMany();

  console.log('Menambahkan data divisi PI baru...');
  const divisiPIRecords = DIVISI.map((divisi) => ({
    id: uuidv6(),
    nama: divisi.divisiPI,
  }));

  await prisma.divisiPI.createMany({
    data: divisiPIRecords,
  });

  console.log('Menambahkan data divisi BPH baru...');
  const divisiBPHRecords = DIVISI.flatMap((divisi) =>
    divisi.divisiBPH.map((bph) => ({
      id: uuidv6(),
      nama: bph,
      divisi_bagian: divisi.divisiPI,
    })),
  );

  await prisma.divisiBPH.createMany({
    data: divisiBPHRecords,
  });

  console.log('Seed divisi berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
