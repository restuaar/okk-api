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
      divisiBPH: {
        nama: 'Mentor',
      },
    },
  });

  const kelompokOKKPromises = [];
  for (let i = 1; i <= mentors.length; i++) {
    kelompokOKKPromises.push(
      await prisma.kelompokOKK.upsert({
        where: { no: i },
        update: {},
        create: {
          id: uuidv6(),
          no: i,
          usernameMentor: mentors[i - 1].username,
        },
      }),
    );
  }

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
