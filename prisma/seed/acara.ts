import { PrismaClient } from '@prisma/client';
import { ACARA } from './utils/constant';
import { v6 as uuidv6 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed acara...');

  await prisma.acara.deleteMany();

  console.log('Menambahkan data acara...');

  const acaraRecords = ACARA.map((acara) => ({
    id: uuidv6(),
    nama: acara.nama,
    tempat: acara.tempat,
    waktu_mulai: acara.waktuMulai,
    waktu_selesai: acara.waktuSelesai,
    deskripsi: acara.deskripsi,
  }));

  await prisma.acara.createMany({
    data: acaraRecords,
  });

  console.log('Seed acara berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
