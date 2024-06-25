import { Akun, PrismaClient } from '@prisma/client';
import { faker, fakerID_ID } from '@faker-js/faker';

const prisma = new PrismaClient();

interface PanitiaSeed {
  username: string;
  nama: string;
  fakultas: string;
  jurusan: string;
  angkatan: number;
}

const getAkun = async (): Promise<Akun[]> => {
  return await prisma.akun.findMany({
    take: 10,
  });
};

const angkatan: number[] = [2020, 2021, 2022, 2023];

const createRandomPanitia = async (): Promise<PanitiaSeed> => {
  const akun = await getAkun();
  for (let i = 0; i < akun.length; i++) {
    return {
      username: akun[i].username,
      nama: fakerID_ID.person.firstName(),
      fakultas: fakerID_ID.person.firstName(),
      jurusan: fakerID_ID.person.firstName(),
      angkatan: angkatan[Math.floor(Math.random() * angkatan.length)],
    };
  }
};

async function main() {
  console.log('Menjalankan seed panitia...');
  console.log('Menghapus data panitia lama...');
  await prisma.panitia.deleteMany();
  console.log('Seed panitia berhasil!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
