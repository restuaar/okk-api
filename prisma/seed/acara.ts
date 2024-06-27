import { PrismaClient } from '@prisma/client';
import { ACARA, BANYAK_ACARA } from './utils/constant';
import { v6 as uuidv6 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed acara...');

  console.log('Menghapus data acara lama...');
  await prisma.acara.deleteMany();

  console.log('Menambahkan data acara...');

  const acaraPromises = [];

  for (let i = 0; i < BANYAK_ACARA; i++) {
    const uuid = uuidv6();
    const acara = ACARA[i];
    acaraPromises.push(
      await prisma.acara.upsert({
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
      }),
    );
  }

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
