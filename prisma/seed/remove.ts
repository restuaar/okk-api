import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed remove...');

  console.log('Menghapus data divisi BPH lama...');
  await prisma.divisiBPH.deleteMany();

  console.log('Menghapus data divisi PI lama...');
  await prisma.divisiPI.deleteMany();

  console.log('Menghapus data akun lama...');
  await prisma.akun.deleteMany();

  console.log('Seed remove berhasil!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
