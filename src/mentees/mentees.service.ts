import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { MenteeOptions } from 'src/interfaces/options.interface';
import { MenteeEntity } from './entities/mentee.entity';
import { CreateMenteeDto } from './dto/create-mentee.dto';
import { SearchMenteeDto } from './dto/searh-mentee.dto';
import { getPaginationData } from 'src/utils/get-pagination';
import { Page } from 'src/dto/success.dto';

@Injectable()
export class MenteesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async searchMentees(
    searchMenteeDto: SearchMenteeDto,
    options?: MenteeOptions,
  ): Promise<{ mentees: MenteeEntity[]; page: Page }> {
    this.logger.log('Get mentees', 'MenteesService');

    const { nama, fakultas, jurusan, angkatan, page, size } = searchMenteeDto;

    const filterOptions = {
      AND: [
        { akun: { nama: { contains: nama } } },
        { fakultas: { contains: fakultas } },
        { jurusan: { contains: jurusan } },
        angkatan ? { angkatan } : {},
      ],
    };
    const [result, totalData] = await Promise.all([
      await this.prismaService.mentee.findMany({
        where: filterOptions,
        include: {
          akun: options.includeAkun,
          hadirMentoring: options.includeMentoring,
          kelompokOKK: options.includeGroup,
        },
        skip: (page - 1) * size,
        take: size,
      }),
      await this.prismaService.mentee.count({ where: filterOptions }),
    ]);

    return {
      mentees: result,
      page: getPaginationData(page, size, totalData),
    };
  }

  async getMentee(
    username: string,
    options?: MenteeOptions,
  ): Promise<MenteeEntity> {
    this.logger.log('Get mentee', 'MenteesService');

    const mentee = await this.prismaService.mentee.findUnique({
      where: { username },
      include: {
        akun: options.includeAkun,
        hadirMentoring: options.includeMentoring,
        kelompokOKK: options.includeGroup,
      },
    });

    if (!mentee) {
      throw new NotFoundException('Mentee not found');
    }

    return mentee;
  }

  async createMentee(createMenteeDto: CreateMenteeDto) {
    this.logger.log('Create mentee', 'MenteesService');

    const { username, fakultas, jurusan, angkatan, no_kelompok_okk } =
      createMenteeDto;

    this.validateMentee(username, no_kelompok_okk);

    const mentee = await this.prismaService.mentee.create({
      data: {
        username,
        fakultas,
        jurusan,
        angkatan,
        no_kelompok_okk,
      },
    });

    return mentee;
  }

  async updateMentee(
    username: string,
    updateMenteeDto: CreateMenteeDto,
    options?: MenteeOptions,
  ): Promise<MenteeEntity> {
    this.logger.log('Update mentee', 'MenteesService');

    const {
      username: updateUsername,
      fakultas,
      jurusan,
      angkatan,
      no_kelompok_okk,
    } = updateMenteeDto;

    await this.validateMentee(updateUsername, no_kelompok_okk);

    const mentee = await this.getMentee(username);

    return await this.prismaService.mentee.update({
      where: { username },
      data: {
        username: updateUsername ?? mentee.username,
        fakultas: fakultas ?? mentee.fakultas,
        jurusan: jurusan ?? mentee.jurusan,
        angkatan: angkatan ?? mentee.angkatan,
        no_kelompok_okk: no_kelompok_okk ?? mentee.no_kelompok_okk,
      },
      include: {
        akun: options.includeAkun,
        hadirMentoring: options.includeMentoring,
        kelompokOKK: options.includeGroup,
      },
    });
  }

  async deleteMentee(username: string, options?: MenteeOptions) {
    this.logger.log('Delete mentee', 'MenteesService');

    const mentee = this.getMentee(username);

    await this.prismaService.mentee.delete({
      where: { username },
      include: {
        akun: options.includeAkun,
        hadirMentoring: options.includeMentoring,
        kelompokOKK: options.includeGroup,
      },
    });

    return mentee;
  }

  async validateMentee(username: string, no_kelompok_okk: number) {
    const userExist = await this.prismaService.akun.findUnique({
      where: { username },
    });
    if (!userExist) {
      throw new NotFoundException('Username doesnt exist');
    }

    const menteeExist = await this.prismaService.mentee.findUnique({
      where: { username },
    });
    if (menteeExist) {
      throw new NotFoundException('Mentee already exist');
    }

    const groupExist = await this.prismaService.kelompokOKK.findUnique({
      where: { no: no_kelompok_okk },
    });
    if (!groupExist) {
      throw new NotFoundException('Group doesnt exist');
    }
  }
}
