import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { SponsorOptions } from 'src/interfaces/options.interface';
import {
  CreateEventSponsorDto,
  CreateSponsorDto,
} from './dto/create-sponsor.dto';
import {
  UpdateEventSponsorDto,
  UpdateSponsorDto,
} from './dto/update-sponsor.dto';

@Injectable()
export class SponsorsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getSponsors(options?: SponsorOptions) {
    this.logger.log('Get sponsors', 'SponsorsService');

    return this.prismaService.sponsor.findMany({
      include: {
        acara: options.includeAcara,
        akun: options.includeAkun,
      },
    });
  }

  async getSponsor(username: string, options?: SponsorOptions) {
    this.logger.log('Get sponsor', 'SponsorsService');

    const sponsor = this.prismaService.sponsor.findUnique({
      where: { username },
      include: {
        acara: options.includeAcara,
        akun: options.includeAkun,
      },
    });

    if (!sponsor) {
      throw new NotFoundException('Sponsor not found');
    }

    return sponsor;
  }

  async createSponsor(data: CreateSponsorDto) {
    this.logger.log('Create sponsor', 'SponsorsService');

    await this.checkAkun(data.username);

    return this.prismaService.sponsor.create({
      data,
    });
  }

  async updateSponsor(
    username: string,
    data: UpdateSponsorDto,
    options?: SponsorOptions,
  ) {
    this.logger.log('Update sponsor', 'SponsorsService');

    const { username: dataUsername, kontak } = data;

    const sponsor = await this.getSponsor(username);

    return this.prismaService.sponsor.update({
      where: { username },
      data: {
        username: dataUsername ?? sponsor.username,
        kontak: kontak ?? sponsor.kontak,
      },
      include: {
        acara: options.includeAcara,
        akun: options.includeAkun,
      },
    });
  }

  async deleteSponsor(username: string, options?: SponsorOptions) {
    this.logger.log('Delete sponsor', 'SponsorsService');

    await this.getSponsor(username);

    return this.prismaService.sponsor.delete({
      where: { username },
      include: {
        acara: options.includeAcara,
        akun: options.includeAkun,
      },
    });
  }

  async addEventSponsor(data: CreateEventSponsorDto) {
    this.logger.log('Assign event sponsor', 'SponsorsService');

    const { id_acara, id_sponsor } = data;

    await this.checkEvent(id_acara);
    await this.getSponsor(id_sponsor);

    return this.prismaService.acaraSponsor.create({
      data,
      include: {
        acara: true,
      },
    });
  }

  async updateEventSponsor(data: UpdateEventSponsorDto) {
    this.logger.log('Update event sponsor', 'SponsorsService');

    const { id_acara, id_sponsor } = data;

    await this.checkEvent(id_acara);
    await this.getSponsor(id_sponsor);

    return this.prismaService.acaraSponsor.update({
      where: { id_acara_id_sponsor: { id_acara, id_sponsor } },
      data,
      include: {
        acara: true,
      },
    });
  }

  async removeAllEventSponsor(id_acara: string) {
    this.logger.log('Remove all event sponsor', 'SponsorsService');

    const event = await this.checkEvent(id_acara, true);

    this.prismaService.acaraSponsor.deleteMany({
      where: { id_acara },
    });

    return event;
  }

  async removeEventSponsor(id_acara: string, id_sponsor: string) {
    this.logger.log('Remove event sponsor', 'SponsorsService');

    await this.checkEvent(id_acara);
    await this.getSponsor(id_sponsor);

    return this.prismaService.acaraSponsor.delete({
      where: { id_acara_id_sponsor: { id_acara, id_sponsor } },
      include: {
        acara: true,
        sponsor: true,
      },
    });
  }

  async checkEvent(id_acara: string, sponsor: boolean = false) {
    const event = await this.prismaService.acara.findUnique({
      where: { id: id_acara },
      include: {
        sponsor,
      },
    });

    if (!event) {
      throw new NotFoundException('Acara not found');
    }

    return event;
  }

  async checkAkun(username: string) {
    const akun = await this.prismaService.akun.findUnique({
      where: { username },
    });

    if (!akun) {
      throw new NotFoundException('Akun not found');
    }
  }
}
