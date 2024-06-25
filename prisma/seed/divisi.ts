import { PrismaClient } from '@prisma/client';
import { v6 as uuidv6 } from 'uuid';

const prisma = new PrismaClient();

interface DivisiPISeed {
  id: string;
  nama: string;
}

interface DivisiBPHSeed {
  id: string;
  nama: string;
  divisiBagian: string;
}

// data
const divisi = {
  'Project Officer': [],
  'Vice Project Officer Internal': [],
  'Vice Project Officer External': [],
  'Sekretaris Umum': ['Kesekretariatan'],
  Controller: ['PSDM', 'Kelembagaan'],
  Treasurer: ['Sponsorship', 'Media Partner'],
  'Koordinator bidang Acara': ['Acara Puncak', 'Project', 'Eksplorasi'],
  'Sarana dan Prasarana': [
    'Dekorasi dan Wardrobe',
    'Transportasi dan Konsumsi',
  ],
  Operasional: ['Keamanan', 'Medis', 'Logistik'],
  'Materi dan Mentor': ['Materi', 'Mentor'],
  Kreatif: ['IT dan Broadcast', 'Visual Design dan Dokumentasi'],
  Relasi: ['Perizinan', 'Media Informasi'],
};

const divisiPI = Object.keys(divisi);

async function main() {
  console.log('Menjalankan seed divisi...');
  console.log('Menghapus data divisi lama...');
  await prisma.divisiBPH.deleteMany();
  await prisma.divisiPI.deleteMany();

  console.log('Menambahkan data divisi PI...');
  const divisiPIPromises = divisiPI.map(async (nama) => {
    const divisiPI: DivisiPISeed = {
      id: uuidv6(),
      nama,
    };
    await prisma.divisiPI.upsert({
      where: { nama },
      update: {},
      create: divisiPI,
    });
  });

  await Promise.all(divisiPIPromises);

  console.log('Menambahkan data divisi BPH...');
  const divisiBPHPromise = Object.entries(divisi).map(
    ([divisiBagian, divisiNama]) => {
      const divisiBPH: DivisiBPHSeed[] = divisiNama.map((nama: string) => ({
        id: uuidv6(),
        nama,
        divisiBagian: divisiBagian,
      }));

      return divisiBPH.map(async (divisi) => {
        await prisma.divisiBPH.upsert({
          where: { nama: divisi.nama },
          update: {},
          create: divisi,
        });
      });
    },
  );
  Promise.all(divisiBPHPromise);

  console.log('Seed divisi berhasil!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
