import { Acara, DivisiOKK, FakultasUI } from './interface';

export const ROUND_OF_SALT = 10;

export const USER_NUMBER = 200;

export const ANGGOTA_PER_DIVISI = 5;

export const MENTEE_PER_KELOMPOK = 10;

export const BANYAK_PEMBICARA = 10;

export const BANYAK_SPONSOR = 5;

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

export const ACARA: Acara[] = [
  {
    nama: 'Pembukaan OKK UI',
    waktuMulai: '2024-07-29T07:00:00Z',
    waktuSelesai: '2024-07-29T12:00:00Z',
    tempat: 'Balairung',
    deskripsi:
      'Acara pembukaan resmi OKK UI yang menghadirkan sambutan dari rektor dan para dekan, serta penampilan seni dari mahasiswa.',
  },
  {
    nama: 'Pengenalan Fakultas dan Program Studi',
    waktuMulai: '2024-07-30T08:00:00Z',
    waktuSelesai: '2024-07-30T15:00:00Z',
    tempat: 'Auditorium Fakultas Ekonomi dan Bisnis',
    deskripsi:
      'Sesi pengenalan fakultas dan program studi yang diikuti oleh seluruh mahasiswa baru, dengan presentasi dari dekan dan dosen.',
  },
  {
    nama: 'Kegiatan Kebersamaan Mahasiswa',
    waktuMulai: '2024-07-31T09:00:00Z',
    waktuSelesai: '2024-07-31T13:00:00Z',
    tempat: 'Lapangan Sepak Bola UI',
    deskripsi:
      'Berbagai permainan dan aktivitas tim untuk membangun kebersamaan dan kekompakan antar mahasiswa baru.',
  },
  {
    nama: 'Pengenalan Unit Kegiatan Mahasiswa (UKM)',
    waktuMulai: '2024-08-01T10:00:00Z',
    waktuSelesai: '2024-08-01T16:00:00Z',
    tempat: 'Pusat Kegiatan Mahasiswa (Pusgiwa)',
    deskripsi:
      'Mahasiswa baru berkesempatan untuk mengenal berbagai UKM yang ada di UI, mulai dari bidang olahraga, seni, hingga akademik.',
  },
  {
    nama: 'Seminar Motivasi dan Inspirasi',
    waktuMulai: '2024-08-02T13:00:00Z',
    waktuSelesai: '2024-08-02T17:00:00Z',
    tempat: 'Aula Makara Art Center',
    deskripsi:
      'Seminar yang menghadirkan pembicara inspiratif dari berbagai bidang untuk memberikan motivasi dan pandangan hidup kepada mahasiswa baru.',
  },
  {
    nama: 'Pameran dan Expo Mahasiswa Baru',
    waktuMulai: '2024-08-03T09:00:00Z',
    waktuSelesai: '2024-08-03T14:00:00Z',
    tempat: 'Plaza UI',
    deskripsi:
      'Pameran yang menampilkan berbagai karya dan inovasi dari mahasiswa serta informasi penting mengenai layanan kampus.',
  },
  {
    nama: 'Penutupan OKK UI',
    waktuMulai: '2024-08-04T16:00:00Z',
    waktuSelesai: '2024-08-04T19:00:00Z',
    tempat: 'Balairung',
    deskripsi:
      'Acara penutupan OKK UI dengan berbagai penampilan seni, pemberian penghargaan, dan pesan dari pimpinan universitas.',
  },
];

export const BANYAK_ACARA = ACARA.length;
