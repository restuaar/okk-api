import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateEventSpeakerDto,
  CreateSpeakerDto,
} from './dto/create-speaker.dto';
import {
  UpdateEventSpeakerDto,
  UpdateSpeakerDto,
} from './dto/update-speaker.dto';
import { PrismaService } from 'src/common/database/database.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { SpeakerOptions } from 'src/interfaces/options.interface';

@Injectable()
export class SpeakersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getSpeakers(options?: SpeakerOptions) {
    this.logger.log('Get speakers', 'SpeakersService');

    return this.prismaService.pembicara.findMany({
      include: {
        acara: options.includeAcara,
        akun: options.includeAkun,
      },
    });
  }

  async getSpeaker(username: string, options?: SpeakerOptions) {
    this.logger.log('Get speaker', 'SpeakersService');

    const speaker = this.prismaService.pembicara.findUnique({
      where: { username },
      include: {
        acara: options.includeAcara,
        akun: options.includeAkun,
      },
    });

    if (!speaker) {
      throw new NotFoundException('Speaker not found');
    }

    return speaker;
  }

  async createSpeaker(data: CreateSpeakerDto) {
    this.logger.log('Create speaker', 'SpeakersService');

    await this.checkAkun(data.username);

    return this.prismaService.pembicara.create({
      data,
    });
  }

  async updateSpeaker(
    username: string,
    data: UpdateSpeakerDto,
    options?: SpeakerOptions,
  ) {
    this.logger.log('Update speaker', 'SpeakersService');

    const { username: dataUsername, kontak } = data;

    const speaker = await this.getSpeaker(username);

    return this.prismaService.pembicara.update({
      where: { username },
      data: {
        username: dataUsername ?? speaker.username,
        kontak: kontak ?? speaker.kontak,
      },
      include: {
        acara: options.includeAcara,
        akun: options.includeAkun,
      },
    });
  }

  async deleteSpeaker(username: string, options?: SpeakerOptions) {
    this.logger.log('Delete speaker', 'SpeakersService');

    await this.getSpeaker(username);

    return this.prismaService.pembicara.delete({
      where: { username },
      include: {
        acara: options.includeAcara,
        akun: options.includeAkun,
      },
    });
  }

  async addSpeakerEvent(data: CreateEventSpeakerDto) {
    this.logger.log('Add speaker to event', 'SpeakersService');

    const { id_acara, id_pembicara } = data;

    await this.checkEvent(id_acara);
    await this.getSpeaker(id_pembicara);

    return this.prismaService.acaraPembicara.create({
      data,
      include: {
        acara: true,
      },
    });
  }

  async updateEventSpeaker(data: UpdateEventSpeakerDto) {
    this.logger.log('Update event speaker', 'SpeakersService');

    const { id_acara, id_pembicara } = data;

    await this.checkEvent(id_acara);
    await this.getSpeaker(id_pembicara);

    return this.prismaService.acaraPembicara.update({
      where: {
        id_acara_id_pembicara: {
          id_acara,
          id_pembicara,
        },
      },
      data,
      include: {
        acara: true,
      },
    });
  }

  async removeAllEventSpeakers(id_acara: string) {
    this.logger.log('Remove all event speakers', 'SpeakersService');

    const event = await this.checkEvent(id_acara);

    this.prismaService.acaraPembicara.deleteMany({
      where: { id_acara },
    });

    return event;
  }

  async deleteEventSpeaker(id_acara: string, id_pembicara: string) {
    this.logger.log('Delete event speaker', 'SpeakersService');

    await this.checkEvent(id_acara);
    await this.getSpeaker(id_pembicara);

    return this.prismaService.acaraPembicara.delete({
      where: {
        id_acara_id_pembicara: {
          id_acara,
          id_pembicara,
        },
      },
      include: {
        acara: true,
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
