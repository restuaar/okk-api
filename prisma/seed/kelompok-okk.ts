import { PrismaClient } from '@prisma/client';
import { v6 as uuidv6 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seed kelompok OKK...');

  console.log('Menghapus data kelompok OKK lama...');
  await prisma.kelompokOKK.deleteMany();

  console.log('Menambahkan data kelompok OKK...');

  const mentors = await prisma.panitia.findMany({
    where: {
      divisi_bph: {
        nama: 'Mentor',
      },
    },
  });

  const kelompokOKKPromises = mentors.map((mentor, index) => {
    return prisma.kelompokOKK.upsert({
      where: { no: index + 1 },
      update: {},
      create: {
        id: uuidv6(),
        no: index + 1,
        username_mentor: mentor.username,
      },
    });
  });

  await Promise.all(kelompokOKKPromises);

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
