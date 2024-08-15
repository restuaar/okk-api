import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { EventOptions } from 'src/interfaces/options.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { v6 as uuidv6 } from 'uuid';
import { UpdateEventDto } from './dto/update-event.dto';
import { SearchEventDto } from './dto/search-event.dto';
import { getPaginationData } from 'src/utils/get-pagination';

@Injectable()
export class EventsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async searchEvents(searchEventDto: SearchEventDto, options?: EventOptions) {
    this.logger.log('Search events', 'EventsService');

    const { nama, waktu_mulai, waktu_selesai, page, size } = searchEventDto;

    this.validateDate(waktu_mulai, waktu_selesai);

    const filterOptions = {
      AND: [
        { nama: { contains: nama } },
        waktu_mulai ? { waktu_mulai } : {},
        waktu_selesai ? { waktu_selesai } : {},
      ],
    };

    const [result, totalData] = await Promise.all([
      this.prismaService.acara.findMany({
        where: filterOptions,
        include: {
          pembicara: options.includePembicara,
          sponsor: options.includeSponsor,
        },
        skip: (page - 1) * size,
        take: size,
      }),
      this.prismaService.acara.count({ where: filterOptions }),
    ]);

    return {
      events: result,
      page: getPaginationData(page, size, totalData),
    };
  }

  async getEvent(eventId: string, options?: EventOptions) {
    this.logger.log('Get event', 'EventsService');

    const event = await this.prismaService.acara.findUnique({
      where: {
        id: eventId,
      },
      include: {
        pembicara: options.includePembicara,
        sponsor: options.includeSponsor,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async createEvent(createEventDto: CreateEventDto) {
    this.logger.log('Create event', 'EventsService');

    const { waktu_mulai, waktu_selesai } = createEventDto;

    this.validateDate(waktu_mulai, waktu_selesai);

    const event = await this.prismaService.acara.create({
      data: {
        id: uuidv6(),
        ...createEventDto,
      },
    });

    return event;
  }

  async updateEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
    options?: EventOptions,
  ) {
    this.logger.log('Update event', 'EventsService');

    const { waktu_mulai, waktu_selesai } = updateEventDto;

    this.validateDate(waktu_mulai, waktu_selesai);

    const event = await this.getEvent(eventId);

    return await this.prismaService.acara.update({
      where: {
        id: eventId,
      },
      data: {
        nama: updateEventDto.nama ?? event.nama,
        waktu_mulai: updateEventDto.waktu_mulai ?? event.waktu_mulai,
        waktu_selesai: updateEventDto.waktu_selesai ?? event.waktu_selesai,
        tempat: updateEventDto.tempat ?? event.tempat,
        deskripsi: updateEventDto.deskripsi ?? event.deskripsi,
      },
      include: {
        pembicara: options.includePembicara,
        sponsor: options.includeSponsor,
      },
    });
  }

  async deleteEvent(eventId: string, options: EventOptions) {
    this.logger.log('Delete event', 'EventsService');

    const event = await this.getEvent(eventId, options);

    await this.prismaService.acara.delete({
      where: {
        id: eventId,
      },
    });

    return event;
  }

  validateDate(mulai: string, akhir: string) {
    const start = Date.parse(mulai);
    const end = Date.parse(akhir);

    if (isNaN(start) || isNaN(end)) {
      throw new BadRequestException('Invalid date');
    }

    if (start > end) {
      throw new BadRequestException('Start date must be before end date');
    }
  }
}
