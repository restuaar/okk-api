export interface PayloadAuth {
  sub: string;
  iat?: number;
  exp?: number;
}

export interface UserRole {
  role: Role;
  type: TypeUser;
}

export interface TypeUser {
  panitia?: boolean;
  sponsor?: boolean;
  pembicara?: boolean;
  mentee?: boolean;
}

export enum Role {
  PANITIA = 'PANITIA',
  PJ = 'PJ',
  PENGURUS_INTI = 'PENGURUS_INTI',
  SPONSOR = 'SPONSOR',
  PEMBICARA = 'PEMBICARA',
  MENTEE = 'PESERTA',
  AKUN = 'AKUN',
}
