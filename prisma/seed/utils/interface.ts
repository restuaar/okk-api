export interface AkunSeed {
  id: string;
  username: string;
  password: string;
  nama: string;
}

export interface FakultasUI {
  fakultas: string;
  jurusan: string[];
}

export interface DivisiOKK {
  divisiPI: string;
  divisiBPH: string[];
}

export interface Acara {
  nama: string;
  waktuMulai: string;
  waktuSelesai: string;
  tempat: string;
  deskripsi: string;
}
