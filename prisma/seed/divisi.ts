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
  const divisiPIPromises = DIVISI.map((divisi) => {
    const uuid = uuidv6();
    return prisma.divisiPI.upsert({
      where: { id: uuid },
      update: {},
      create: {
        id: uuid,
        nama: divisi.divisiPI,
      },
    });
  });

  await Promise.all(divisiPIPromises);

  console.log('Menambahkan data divisi BPH...');
  const divisiBPHPromise = DIVISI.map((divisi) => {
    return divisi.divisiBPH.map((bph) => {
      const uuid = uuidv6();
      return prisma.divisiBPH.upsert({
        where: { id: uuid },
        update: {},
        create: {
          id: uuid,
          nama: bph,
          divisiBagian: divisi.divisiPI,
        },
      });
    });
  });

  await Promise.all(divisiBPHPromise.map((promise) => Promise.all(promise)));

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
