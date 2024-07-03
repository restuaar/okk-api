const units = {
  s: 1000, // Detik ke milidetik
  m: 60 * 1000, // Menit ke milidetik
  h: 60 * 60 * 1000, // Jam ke milidetik
  d: 24 * 60 * 60 * 1000, // Hari ke milidetik
  w: 7 * 24 * 60 * 60 * 1000, // Minggu ke milidetik
  mo: 30 * 24 * 60 * 60 * 1000, // Bulan ke milidetik
  y: 365 * 24 * 60 * 60 * 1000, // Tahun ke milidetik
};

export const jwtConvertTime = (time: string): number => {
  const [, value, unit] = time.match(/^(\d+)([smhd])$/);

  return parseInt(value) * units[unit];
};
