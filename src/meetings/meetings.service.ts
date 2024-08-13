import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { v6 as uuidv6 } from 'uuid';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { SearchMeetingDto } from './dto/search-meeting.dto';
import { getPaginationData } from 'src/utils/get-pagination';
import { MeetingEntity } from './entities/meeting.entity';
import { Page } from 'src/dto/success.dto';

@Injectable()
export class MeetingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getMeetings(
    divisionId: string,
    dateString?: string,
    options?: SearchMeetingDto,
  ): Promise<{ data: MeetingEntity[]; page: Page }> {
    this.logger.log('Get all meetings', 'MeetingsService');

    const query = { divisi_bph_id: divisionId };
    let queryWithDate = {};

    if (dateString) {
      const date = Date.parse(dateString);
      if (isNaN(date)) {
        throw new BadRequestException('Invalid date');
      }

      queryWithDate = { divisi_bph_id: divisionId, waktu: { gte: date } };
    }

    const meetings = await this.prismaService.rapatBPH.findMany({
      where: dateString ? queryWithDate : query,
      include: {
        panitia_hadir: {
          include: {
            panitia: true,
          },
        },
      },
      take: options.size,
      skip: (options.page - 1) * options.size,
    });

    const totalData = await this.prismaService.rapatBPH.count({
      where: dateString ? queryWithDate : query,
    });

    return {
      data: meetings,
      page: getPaginationData(options.page, options.size, totalData),
    };
  }

  async getMeeting(
    divisionId: string,
    meetingId: string,
  ): Promise<MeetingEntity> {
    this.logger.log('Get meeting', 'MeetingsService');

    const meeting = await this.prismaService.rapatBPH.findUnique({
      where: {
        divisi_bph_id_id: {
          divisi_bph_id: divisionId,
          id: meetingId,
        },
      },
      include: {
        panitia_hadir: {
          include: {
            panitia: true,
          },
        },
      },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return meeting;
  }

  async createMeeting(
    divisionId: string,
    createMeetingDto: CreateMeetingDto,
  ): Promise<MeetingEntity> {
    this.logger.log('Create meeting', 'MeetingsService');

    return await this.prismaService.rapatBPH.create({
      data: {
        divisi_bph_id: divisionId,
        id: uuidv6(),
        ...createMeetingDto,
      },
    });
  }

  async updateMeeting(
    divisionId: string,
    meetingId: string,
    updateMeetingDto: UpdateMeetingDto,
  ): Promise<MeetingEntity> {
    this.logger.log('Update meeting', 'MeetingsService');

    const meeting = await this.getMeeting(divisionId, meetingId);

    return await this.prismaService.rapatBPH.update({
      where: {
        divisi_bph_id_id: {
          divisi_bph_id: divisionId,
          id: meetingId,
        },
      },
      data: {
        kesimpulan: updateMeetingDto.kesimpulan ?? meeting.kesimpulan,
        tempat: updateMeetingDto.tempat ?? meeting.tempat,
        waktu: updateMeetingDto.waktu ?? meeting.waktu,
      },
      include: {
        panitia_hadir: {
          include: {
            panitia: true,
          },
        },
      },
    });
  }

  async deleteMeetings(divisionId: string): Promise<MeetingEntity[]> {
    this.logger.log('Delete meeting', 'MeetingsService');

    const meeting = await this.getMeetings(divisionId, null);

    await this.prismaService.rapatBPH.deleteMany({
      where: {
        divisi_bph_id: divisionId,
      },
    });

    return meeting.data;
  }

  async deleteMeeting(
    divisionId: string,
    meetingId: string,
  ): Promise<MeetingEntity> {
    this.logger.log('Delete meeting', 'MeetingsService');

    const meeting = await this.getMeeting(divisionId, meetingId);

    await this.prismaService.rapatBPH.delete({
      where: {
        divisi_bph_id_id: {
          divisi_bph_id: divisionId,
          id: meetingId,
        },
      },
    });

    return meeting;
  }

  async addAttendance(
    divisionId: string,
    meetingId: string,
    username: string,
  ): Promise<string> {
    this.logger.log('Absen meeting', 'MeetingsService');

    const meeting = await this.getMeeting(divisionId, meetingId);

    const waktuHadir = new Date();
    if (meeting.waktu > waktuHadir) {
      throw new BadRequestException('Meeting has not started');
    }

    const panitiaRapat = await this.prismaService.panitiaRapatBPH.findFirst({
      where: {
        rapat_id: meeting.id,
        panitia_username: username,
      },
    });
    if (panitiaRapat) {
      throw new BadRequestException('Already absen');
    }

    await this.prismaService.panitiaRapatBPH.create({
      data: {
        rapat_id: meeting.id,
        waktu_hadir: waktuHadir.toISOString(),
        waktu_rapat: meeting.waktu,
        divisi_bph_id: divisionId,
        panitia_username: username,
      },
    });

    return 'Success';
  }

  async deleteAttendance(
    divisionId: string,
    meetingId: string,
    username: string,
  ): Promise<string> {
    this.logger.log('Delete absen meeting', 'MeetingsService');

    await this.getMeeting(divisionId, meetingId);

    await this.prismaService.panitiaRapatBPH.delete({
      where: {
        panitia_username_divisi_bph_id_rapat_id: {
          panitia_username: username,
          divisi_bph_id: divisionId,
          rapat_id: meetingId,
        },
      },
    });

    return 'Success';
  }
}
