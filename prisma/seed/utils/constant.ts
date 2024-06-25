import { DivisiOKK, FakultasUI } from './interface';

export const ROUND_OF_SALT = 10;

export const USER_NUMBER = 200;

export const ANGGOTA_PER_DIVISI = 5;

export const AKUN_KOSONG = [
  {
    Panitia: { is: null },
  },
  {
    Mentee: { is: null },
  },
  {
    Pembicara: { is: null },
  },
  {
    Sponsor: { is: null },
  },
];

export const DIVISI: DivisiOKK[] = [
  {
    divisiPI: 'Project Officer',
    divisiBPH: [],
  },
  {
    divisiPI: 'Vice Project Officer Internal',
    divisiBPH: [],
  },
  {
    divisiPI: 'Vice Project Officer External',
    divisiBPH: [],
  },
  {
    divisiPI: 'Sekretaris Umum',
    divisiBPH: ['Kesekretariatan'],
  },
  {
    divisiPI: 'Controller',
    divisiBPH: ['PSDM', 'Kelembagaan'],
  },
  {
    divisiPI: 'Treasurer',
    divisiBPH: ['Sponsorship', 'Media Partner'],
  },
  {
    divisiPI: 'Koordinator bidang Acara',
    divisiBPH: ['Acara Puncak', 'Project', 'Eksplorasi'],
  },
  {
    divisiPI: 'Sarana dan Prasarana',
    divisiBPH: ['Dekorasi dan Wardrobe', 'Transportasi dan Konsumsi'],
  },
  {
    divisiPI: 'Operasional',
    divisiBPH: ['Keamanan', 'Medis', 'Logistik'],
  },
  {
    divisiPI: 'Materi dan Mentor',
    divisiBPH: ['Materi', 'Mentor'],
  },
  {
    divisiPI: 'Kreatif',
    divisiBPH: ['IT dan Broadcast', 'Visual Design dan Dokumentasi'],
  },
  {
    divisiPI: 'Relasi',
    divisiBPH: ['Perizinan', 'Media Informasi'],
  },
];

export const FAKULTAS_UI: FakultasUI[] = [
  {
    fakultas: 'Fakultas Ilmu Komputer',
    jurusan: ['Ilmu Komputer', 'Sistem Informasi'],
  },
  {
    fakultas: 'Fakultas Teknik',
    jurusan: [
      'Teknik Sipil',
      'Teknik Mesin',
      'Teknik Elektro',
      'Teknik Metalurgi dan Material',
      'Teknik Kimia',
      'Teknik Industri',
      'Teknik Lingkungan',
      'Teknik Perkapalan',
      'Teknik Komputer',
      'Arsitektur',
      'Teknik Biomedis',
    ],
  },
  {
    fakultas: 'Fakultas Kedokteran',
    jurusan: ['Kedokteran Umum', 'Kedokteran Gigi', 'Kedokteran Hewan'],
  },
  {
    fakultas: 'Fakultas Psikologi',
    jurusan: ['Psikologi'],
  },
  {
    fakultas: 'Fakultas Hukum',
    jurusan: ['Ilmu Hukum'],
  },
  {
    fakultas: 'Fakultas Ekonomi dan Bisnis',
    jurusan: ['Ilmu Ekonomi', 'Manajemen', 'Akuntansi'],
  },
  {
    fakultas: 'Fakultas Ilmu Sosial dan Ilmu Politik',
    jurusan: [
      'Ilmu Komunikasi',
      'Ilmu Politik',
      'Ilmu Administrasi Negara',
      'Sosiologi',
      'Kriminologi',
      'Antropologi',
      'Ilmu Kesejahteraan Sosial',
      'Ilmu Hubungan Internasional',
    ],
  },
  {
    fakultas: 'Fakultas Ilmu Budaya',
    jurusan: [
      'Sastra Indonesia',
      'Sastra Inggris',
      'Sastra Jepang',
      'Sastra Jerman',
      'Sastra Perancis',
      'Sastra Belanda',
      'Sastra Arab',
      'Sastra Cina',
      'Sastra Rusia',
      'Ilmu Perpustakaan',
      'Ilmu Filsafat',
      'Ilmu Sejarah',
      'Ilmu Arkeologi',
    ],
  },
  {
    fakultas: 'Fakultas Matematika dan Ilmu Pengetahuan Alam',
    jurusan: [
      'Matematika',
      'Fisika',
      'Kimia',
      'Biologi',
      'Geografi',
      'Geofisika',
      'Statistika',
      'Aktuaria',
    ],
  },
  {
    fakultas: 'Fakultas Kesehatan Masyarakat',
    jurusan: [
      'Kesehatan Lingkungan',
      'Kesehatan dan Keselamatan Kerja',
      'Gizi',
      'Biostatistik dan Kependudukan',
      'Epidemiologi',
      'Administrasi dan Kebijakan Kesehatan',
      'Promosi Kesehatan',
    ],
  },
];

export const ANGKATAN: number[] = [2021, 2022, 2023];
