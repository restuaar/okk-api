import { PrismaClient } from '@prisma/client';
import { v6 as uuidv6 } from 'uuid';
import { DIVISI } from './utils/constant';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed divisi...');
  console.log('Menghapus data divisi lama...');
  await prisma.divisiBPH.deleteMany();
  await prisma.divisiPI.deleteMany();

  console.log('Menambahkan data divisi PI...');
  const divisiPIPromises = DIVISI.map(async (divisi) => {
    return await prisma.divisiPI.upsert({
      where: { nama: divisi.divisiPI },
      update: {},
      create: {
        id: uuidv6(),
        nama: divisi.divisiPI,
      },
    });
  });

  await Promise.all(divisiPIPromises);

  console.log('Menambahkan data divisi BPH...');
  const divisiBPHPromise = DIVISI.map((divisi) => {
    divisi.divisiBPH.map(async (bph) => {
      return await prisma.divisiBPH.upsert({
        where: { nama: bph },
        update: {},
        create: {
          id: uuidv6(),
          nama: bph,
          divisiBagian: divisi.divisiPI,
        },
      });
    });
  });
  Promise.all(divisiBPHPromise);

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
