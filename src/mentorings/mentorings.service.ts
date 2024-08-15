import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { SearchMentoringDto } from './dto/search-meeting.dto';
import { getPaginationData } from 'src/utils/get-pagination';
import { CreateMentoringDto } from './dto/create-mentoring.dto';
import { v6 as uuidv6 } from 'uuid';
import { UpdateMentoringDto } from './dto/update-mentoring.dto';

@Injectable()
export class MentoringsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getMentorings(
    noKelompok: number,
    dateString?: string,
    options?: SearchMentoringDto,
  ) {
    this.logger.log('Get all mentorings', 'MentoringsService');

    const query = { no_kelompok: noKelompok };
    let queryWithDate = {};

    if (dateString) {
      const date = Date.parse(dateString);
      if (isNaN(date)) {
        throw new BadRequestException('Invalid date');
      }

      queryWithDate = { no_kelompok: noKelompok, waktu: { gte: date } };
    }

    const [result, totalData] = await Promise.all([
      this.prismaService.mentoring.findMany({
        where: dateString ? queryWithDate : query,
        include: {
          mentee_hadir: {
            include: {
              mentee: true,
            },
          },
          kelompok_okk: true,
        },
        take: options.size,
        skip: (options.page - 1) * options.size,
      }),
      this.prismaService.mentoring.count({
        where: dateString ? queryWithDate : query,
      }),
    ]);

    return {
      mentorings: result,
      page: getPaginationData(options.page, options.size, totalData),
    };
  }

  async getMentoring(noKelompok: number, mentoringId: string) {
    this.logger.log('Get mentoring by id', 'MentoringsService');

    const mentoring = await this.prismaService.mentoring.findUnique({
      where: {
        no_kelompok_id: {
          no_kelompok: noKelompok,
          id: mentoringId,
        },
      },
      include: {
        mentee_hadir: {
          include: {
            mentee: true,
          },
        },
        kelompok_okk: true,
      },
    });

    if (!mentoring) {
      throw new NotFoundException('Mentoring not found');
    }

    return mentoring;
  }

  async createMentoring(
    noKelompok: number,
    createMentoringDto: CreateMentoringDto,
  ) {
    this.logger.log('Create mentoring', 'MentoringsService');

    return await this.prismaService.mentoring.create({
      data: {
        id: uuidv6(),
        no_kelompok: noKelompok,
        ...createMentoringDto,
      },
    });
  }

  async updateMentoring(
    noKelompok: number,
    mentoringId: string,
    updateMentoringDto: UpdateMentoringDto,
  ) {
    this.logger.log('Update mentoring', 'MentoringsService');

    const mentoring = await this.getMentoring(noKelompok, mentoringId);

    if (updateMentoringDto.waktu) {
      const date = Date.parse(updateMentoringDto.waktu);
      if (isNaN(date)) {
        throw new BadRequestException('Invalid date');
      }
    }

    return await this.prismaService.mentoring.update({
      where: {
        no_kelompok_id: {
          no_kelompok: noKelompok,
          id: mentoringId,
        },
      },
      data: {
        materi: updateMentoringDto.materi ?? mentoring.materi,
        tempat: updateMentoringDto.tempat ?? mentoring.tempat,
        waktu: updateMentoringDto.waktu ?? mentoring.waktu,
      },
      include: {
        mentee_hadir: {
          include: {
            mentee: true,
          },
        },
        kelompok_okk: true,
      },
    });
  }

  async deleteMentoring(noKelompok: number, mentoringId: string) {
    this.logger.log('Delete mentoring', 'MentoringsService');

    const mentoring = await this.getMentoring(noKelompok, mentoringId);

    await this.prismaService.mentoring.delete({
      where: {
        no_kelompok_id: {
          no_kelompok: noKelompok,
          id: mentoringId,
        },
      },
    });

    return mentoring;
  }

  async deleteMentorings(noKelompok: number) {
    this.logger.log('Delete mentorings', 'MentoringsService');

    const mentorings = await this.getMentorings(noKelompok);

    await this.prismaService.mentoring.deleteMany({
      where: {
        no_kelompok: noKelompok,
      },
    });

    return mentorings;
  }

  async addAttendee(
    noKelompok: number,
    mentoringId: string,
    menteeUsername: string,
  ) {
    this.logger.log('Add attendee to mentoring', 'MentoringsService');

    const mentoring = await this.getMentoring(noKelompok, mentoringId);

    const waktuHadir = new Date();
    if (mentoring.waktu > waktuHadir) {
      throw new BadRequestException('Mentoring has not started yet');
    }

    const mentee = await this.prismaService.mentee.findUnique({
      where: {
        username: menteeUsername,
        no_kelompok_okk: noKelompok,
      },
    });
    if (!mentee) {
      throw new NotFoundException('Mentee not found or not in this group');
    }

    const menteeMentoring = await this.prismaService.menteeMentoring.findUnique(
      {
        where: {
          mentee_username_mentoring_id_no_kelompok: {
            mentee_username: menteeUsername,
            mentoring_id: mentoringId,
            no_kelompok: noKelompok,
          },
        },
      },
    );
    if (menteeMentoring) {
      throw new BadRequestException(
        'Mentee has already attended this mentoring',
      );
    }

    await this.prismaService.menteeMentoring.create({
      data: {
        mentoring_id: mentoringId,
        mentee_username: menteeUsername,
        waktu_hadir: waktuHadir.toISOString(),
        waktu_mentoring: mentoring.waktu,
        no_kelompok: noKelompok,
      },
    });
    return 'Success';
  }

  async removeAttendee(
    noKelompok: number,
    mentoringId: string,
    menteeUsername: string,
  ) {
    this.logger.log('Remove attendee from mentoring', 'MentoringsService');

    await this.getMentoring(noKelompok, mentoringId);

    const menteeMentoring = await this.prismaService.menteeMentoring.findUnique(
      {
        where: {
          mentee_username_mentoring_id_no_kelompok: {
            mentee_username: menteeUsername,
            mentoring_id: mentoringId,
            no_kelompok: noKelompok,
          },
        },
      },
    );
    if (!menteeMentoring) {
      throw new NotFoundException('Mentee has not attended this mentoring');
    }

    await this.prismaService.menteeMentoring.delete({
      where: {
        mentee_username_mentoring_id_no_kelompok: {
          mentee_username: menteeUsername,
          mentoring_id: mentoringId,
          no_kelompok: noKelompok,
        },
      },
    });

    return 'Success';
  }
}
