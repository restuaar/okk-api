import { PrismaClient, TipeJabatan } from '@prisma/client';
import { AKUN_KOSONG, ANGGOTA_PER_DIVISI, DIVISI } from './utils/constant';
import {
  getJabatanByIndex,
  getRandomFakultasJurusanAngkatan,
} from './utils/helper';

const prisma = new PrismaClient();

const divisiPI = DIVISI.map((divisi) => divisi.divisiPI);
const divisiBPH = DIVISI.map((divisi) => divisi.divisiBPH).flat();

async function main() {
  console.log('Menjalankan seed panitia...');

  console.log('Menghapus data panitia lama...');
  await prisma.panitia.deleteMany();

  console.log('Menambahkan data panitia PI...');

  const dataAkunPI = await prisma.akun.findMany({
    where: {
      AND: AKUN_KOSONG,
    },
    take: divisiPI.length,
  });

  const panitiaPromises = divisiPI.map(async (divisi, index) => {
    const idDivisi = (
      await prisma.divisiPI.findUnique({
        where: { nama: divisi },
      })
    ).id;

    const dataRandom = getRandomFakultasJurusanAngkatan();

    return await prisma.panitia.upsert({
      where: { username: dataAkunPI[index].username },
      update: {},
      create: {
        username: dataAkunPI[index].username,
        fakultas: dataRandom.fakultas,
        jurusan: dataRandom.jurusan,
        angkatan: dataRandom.angkatan,
        divisiPIId: idDivisi,
        jabatan: TipeJabatan.PENGURUS_INTI,
      },
    });
  });

  await Promise.all(panitiaPromises);

  console.log('Menambahkan data panitia BPH...');

  for (const divisi of divisiBPH) {
    const dataAkunBPH = await prisma.akun.findMany({
      where: {
        AND: AKUN_KOSONG,
      },
      take: ANGGOTA_PER_DIVISI, // anggota per divisi
    });

    const idDivisi = (
      await prisma.divisiBPH.findUnique({
        where: { nama: divisi },
      })
    ).id;

    console.log(`Menambahkan data panitia BPH ${divisi}...`);

    const panitiaBPHPromises = [];

    for (let i = 0; i < ANGGOTA_PER_DIVISI; i++) {
      const dataRandom = getRandomFakultasJurusanAngkatan();
      panitiaBPHPromises.push(
        await prisma.panitia.upsert({
          where: { username: dataAkunBPH[i].username },
          update: {},
          create: {
            username: dataAkunBPH[i].username,
            fakultas: dataRandom.fakultas,
            jurusan: dataRandom.jurusan,
            angkatan: dataRandom.angkatan,
            divisiBPHId: idDivisi,
            jabatan: getJabatanByIndex(i),
          },
        }),
      );
    }

    await Promise.all(panitiaBPHPromises);
  }

  console.log('Seed panitia berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
