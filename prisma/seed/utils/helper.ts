import { TipeJabatan } from '@prisma/client';
import { ANGKATAN, FAKULTAS_UI } from './constant';

export const getRandomInt = (max: number, min: number = 0): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
