import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed remove...');

  console.log('Menghapus data pembicara lama...');
  await prisma.acaraPembicara.deleteMany();
  await prisma.pembicara.deleteMany();

  console.log('Menghapus data sponsor lama...');
  await prisma.acaraSponsor.deleteMany();
  await prisma.sponsor.deleteMany();

  console.log('Menghapus data acara lama...');
  await prisma.acara.deleteMany();

  console.log('Menghapus data mentee lama...');
  await prisma.mentee.deleteMany();

  console.log('Menghapus data kelompok OKK lama...');
  await prisma.kelompokOKK.deleteMany();

  console.log('Menghapus data panitia lama...');
  await prisma.panitia.deleteMany();

  console.log('Menghapus data divisi BPH lama...');
  await prisma.divisiBPH.deleteMany();

  console.log('Menghapus data divisi PI lama...');
  await prisma.divisiPI.deleteMany();

  console.log('Menghapus data akun lama...');
  await prisma.akun.deleteMany();

  console.log('Seed remove berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
