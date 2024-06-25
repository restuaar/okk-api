import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { fakerID_ID } from '@faker-js/faker';
import { v6 as uuidv6 } from 'uuid';

const prisma = new PrismaClient();
const ROUND_OF_SALT = 10;
const USER_NUMBER = 100;

interface AkunSeed {
  id: string;
  username: string;
  password: string;
  nama: string;
}

const createRandomUser = async (): Promise<AkunSeed> => {
  return {
    id: uuidv6(),
    username: fakerID_ID.internet.email(),
    password: await hash(fakerID_ID.internet.password(), ROUND_OF_SALT),
    nama: fakerID_ID.person.fullName(),
  };
};

async function main() {
  console.log('Menjalankan seed akun...');
  console.log('Menghapus data akun lama...');
  await prisma.akun.deleteMany();
  const users = Array.from({ length: USER_NUMBER }, async () => {
    const user = await createRandomUser();
    return await prisma.akun.upsert({
      where: { username: user.username },
      update: {},
      create: user,
    });
  });

  const resultUser = await Promise.all(users);
  console.log(resultUser);
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
