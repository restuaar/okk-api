import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { faker } from '@faker-js/faker';
import { v6 as uuidv6 } from 'uuid';

const prisma = new PrismaClient();
const ROUND_OF_SALT = 10;
const USER_NUMBER = 10;

interface AkunSeed {
  id: string;
  username: string;
  password: string;
}

async function createRandomUser(): Promise<AkunSeed> {
  return {
    id: uuidv6(),
    username: faker.internet.email(),
    password: await hash(faker.internet.password(), ROUND_OF_SALT),
  };
}

async function main() {
  console.log('Menjalankan seed akun...');
  console.log('Menghapus data akun lama...');
  await prisma.akun.deleteMany();
  const users = Array.from({ length: USER_NUMBER }, async () => {
    const user = await createRandomUser();
    return await prisma.akun.upsert({
      where: { username: user.username },
      update: {},
      create: {
        id: user.id,
        username: user.username,
        password: user.password,
      },
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
