import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { fakerID_ID } from '@faker-js/faker';
import { v6 as uuidv6 } from 'uuid';
import { AkunSeed } from './utils/interface';
import { ROUND_OF_SALT, USER_NUMBER } from './utils/constant';

const prisma = new PrismaClient();

const createRandomUser = async (): Promise<AkunSeed> => {
  const namaDepan = fakerID_ID.person.firstName();
  const namaBelakang = fakerID_ID.person.lastName();
  return {
    id: uuidv6(),
    username: fakerID_ID.internet
      .userName({
        firstName: namaDepan,
        lastName: namaBelakang,
      })
      .toLowerCase(),
    password: await hash(fakerID_ID.internet.password(), ROUND_OF_SALT),
    nama: `${namaDepan} ${namaBelakang}`,
  };
};

async function main(): Promise<void> {
  console.log('Menjalankan seed akun...');
  console.log('Menghapus data akun lama...');
  await prisma.akun.deleteMany();

  const userPromises = Array.from({ length: USER_NUMBER }, async () => {
    const user = await createRandomUser();
    return prisma.akun.upsert({
      where: { username: user.username },
      update: {},
      create: user,
    });
  });

  await Promise.all(userPromises);

  // Akun untuk testing
  await prisma.akun.create({
    data: {
      id: uuidv6(),
      username: 'restuaar',
      password: await hash('restuaar', ROUND_OF_SALT),
      nama: 'Restu Ahmad Ar Ridho',
    },
  });
  console.log('Seed akun berhasil!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
