import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { v6 as uuidv6 } from 'uuid';
import { ROUND_OF_SALT, USER_NUMBER } from './utils/constant';
import { createRandomUser } from './utils/helper';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Menjalankan seed akun...');
  console.log('Menghapus data akun lama...');
  await prisma.akun.deleteMany();

  const userRecords = await Promise.all(
    Array.from({ length: USER_NUMBER }, async () => {
      const user = await createRandomUser();
      return {
        id: uuidv6(),
        username: user.username,
        password: await hash(user.password, ROUND_OF_SALT),
        nama: user.nama,
      };
    }),
  );

  await prisma.akun.createMany({ data: userRecords });

  // Menambahkan akun testing
  await prisma.akun.upsert({
    where: { username: 'restuaar' },
    update: {},
    create: {
      id: uuidv6(),
      username: 'restuaar',
      password: await hash('restuaar', ROUND_OF_SALT),
      nama: 'Restu Ahmad Ar Ridho',
    },
  });

  console.log('Seed akun berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
