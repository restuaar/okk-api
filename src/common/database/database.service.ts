import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient, TipeJabatan } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { Role, UserRole } from 'src/interfaces/users.interface';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggerService) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
      ],
    });
  }

  async getRoleUser(unique: string, isId: boolean = false): Promise<UserRole> {
    const fullUser: UserRole = {
      role: Role.AKUN,
      type: null,
    };

    if (isId) {
      const user = await this.akun.findUnique({
        where: {
          id: unique,
        },
      });
      if (!user) {
        return fullUser;
      }
      unique = user.username;
    }

    const panitia = await this.panitia.findUnique({
      where: {
        username: unique,
      },
    });

    if (panitia) {
      const jabatan = panitia.jabatan;
      switch (jabatan) {
        case TipeJabatan.PENGURUS_INTI:
          fullUser.role = Role.PENGURUS_INTI;
          break;
        case TipeJabatan.PJ || TipeJabatan.WA_PJ1 || TipeJabatan.WA_PJ2:
          fullUser.role = Role.PJ;
          break;
        default:
          fullUser.role = Role.PANITIA;
      }

      fullUser.type = {
        panitia: true,
      };

      return fullUser;
    }

    const isMentee = await this.mentee.findUnique({
      where: {
        username: unique,
      },
    });

    if (isMentee) {
      fullUser.role = Role.MENTEE;
      fullUser.type = {
        mentee: true,
      };

      return fullUser;
    }

    const isSponsor = await this.sponsor.findUnique({
      where: {
        username: unique,
      },
    });

    if (isSponsor) {
      fullUser.role = Role.SPONSOR;
      fullUser.type = {
        sponsor: true,
      };

      return fullUser;
    }

    const isPembicara = await this.pembicara.findUnique({
      where: {
        username: unique,
      },
    });

    if (isPembicara) {
      fullUser.role = Role.PEMBICARA;
      fullUser.type = {
        pembicara: true,
      };

      return fullUser;
    }

    return fullUser;
  }

  async onModuleInit() {
    this.$on('info', (e) => {
      this.logger.log(e.message, e.target);
    });
    this.$on('warn', (e) => {
      this.logger.warn(e.message, e.target);
    });
    this.$on('error', (e) => {
      this.logger.error(e.message, e.target);
    });
    this.$on('query', (e) => {
      this.logger.log(JSON.stringify(e), e.target);
    });

    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from the database', 'PrismaService');

    await this.$disconnect();
  }
}
