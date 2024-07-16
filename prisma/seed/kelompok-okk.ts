import { PrismaClient } from '@prisma/client';
import { v6 as uuidv6 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed kelompok OKK...');

  await prisma.kelompokOKK.deleteMany();

  console.log('Menambahkan data kelompok OKK...');

  const mentors = await prisma.panitia.findMany({
    where: {
      divisi_bph: {
        nama: 'Mentor',
      },
    },
  });

  const kelompokOKKRecords = mentors.map((mentor, index) => ({
    id: uuidv6(),
    no: index + 1,
    username_mentor: mentor.username,
  }));

  await prisma.kelompokOKK.createMany({
    data: kelompokOKKRecords,
  });

  console.log('Seed kelompok OKK berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
