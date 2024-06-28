import { PrismaClient } from '@prisma/client';
import { ACARA } from './utils/constant';
import { v6 as uuidv6 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed acara...');

  console.log('Menghapus data acara lama...');
  await prisma.acara.deleteMany();

  console.log('Menambahkan data acara...');

  const acaraPromises = ACARA.map(async (acara) => {
    const uuid = uuidv6();
    return prisma.acara.upsert({
      where: { id: uuid },
      update: {},
      create: {
        id: uuid,
        nama: acara.nama,
        tempat: acara.tempat,
        waktuMulai: acara.waktuMulai,
        waktuSelesai: acara.waktuSelesai,
        deskripsi: acara.deskripsi,
      },
    });
  });

  await Promise.all(acaraPromises);

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
