import { PaketSponsor, TipeJabatan } from '@prisma/client';
import { ANGKATAN, FAKULTAS_UI, ROUND_OF_SALT } from './constant';
import { faker, fakerID_ID } from '@faker-js/faker';
import { AkunSeed } from './interface';
import { hash } from 'bcrypt';
import { v6 as uuidv6 } from 'uuid';

export const getRandomInt = (max: number, min: number = 0): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const createRandomUser = async (): Promise<AkunSeed> => {
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

export const getRandomFakultasJurusanAngkatan = () => {
  const randomNumberFakultas = getRandomInt(FAKULTAS_UI.length - 1);
  const dataFakultas = FAKULTAS_UI[randomNumberFakultas];
  const fakultas = dataFakultas.fakultas;
  const jurusan =
    dataFakultas.jurusan[getRandomInt(dataFakultas.jurusan.length - 1)];
  const angkatan = ANGKATAN[getRandomInt(ANGKATAN.length - 1)];

  return { fakultas, jurusan, angkatan };
};

export const getJabatanByIndex = (index: number): TipeJabatan => {
  switch (index) {
    case 0:
      return TipeJabatan.PJ;
    case 1:
      return TipeJabatan.WA_PJ1;
    case 2:
      return TipeJabatan.WA_PJ2;
    default:
      return TipeJabatan.STAFF;
  }
};

export const getPaketRandom = (): PaketSponsor => {
  const paket: PaketSponsor[] = [
    PaketSponsor.BRONZE,
    PaketSponsor.SILVER,
    PaketSponsor.GOLD,
  ];
  return paket[getRandomInt(paket.length - 1)];
};

export const getRandomCompanyName = () => {
  return faker.company.name();
};

export const usernameFromCompany = (company: string) => {
  return company
    .replace(/ and /gi, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '.')
    .replace(/\.{2,}/g, '.')
    .toLowerCase();
};

export const getRandomKontak = () => {
  return fakerID_ID.phone.number().replace(/[-\s]/g, '').replace('(+62)', '0');
};
