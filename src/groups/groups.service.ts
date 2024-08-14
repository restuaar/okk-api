import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { GroupOptions } from 'src/interfaces/options.interface';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getGroupByNo(no: number, options?: GroupOptions): Promise<GroupEntity> {
    this.logger.log(`Fetching group with no ${no}`, 'GroupsService');

    const group = this.prismaService.kelompokOKK.findUnique({
      where: {
        no,
      },
      include: {
        mentor: options.includeMentor,
        anggota: options.includeAnggota,
        mentoring: options.includeMentoring,
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with no ${no} not found`);
    }

    return group;
  }

  async getGroupByMentor(
    username: string,
    options?: GroupOptions,
  ): Promise<GroupEntity[]> {
    this.logger.log(`Fetching group with mentor ${username}`, 'GroupsService');

    const group = this.prismaService.kelompokOKK.findMany({
      where: {
        username_mentor: username,
      },
      include: {
        mentor: options.includeMentor,
        anggota: options.includeAnggota,
        mentoring: options.includeMentoring,
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with mentor ${username} not found`);
    }

    return group;
  }

  async getAllGroups(options?: GroupOptions): Promise<GroupEntity[]> {
    this.logger.log('Fetching all groups', 'GroupsService');

    const groups = this.prismaService.kelompokOKK.findMany({
      include: {
        mentor: options.includeMentor,
        anggota: options.includeAnggota,
        mentoring: options.includeMentoring,
      },
    });

    return groups;
  }

  async createGroup(data: CreateGroupDto): Promise<GroupEntity> {
    this.logger.log('Creating new group', 'GroupsService');

    const { no, username_mentor } = data;
    this.checkGroup(no, username_mentor);

    const group = this.prismaService.kelompokOKK.create({
      data,
    });

    return group;
  }

  async deleteGroup(no: number, options?: GroupOptions): Promise<GroupEntity> {
    this.logger.log(`Deleting group with no ${no}`, 'GroupsService');

    this.getGroupByNo(no);
    const deletedGroup = this.prismaService.kelompokOKK.delete({
      where: {
        no,
      },
      include: {
        mentor: options.includeMentor,
        anggota: options.includeAnggota,
        mentoring: options.includeMentoring,
      },
    });

    return deletedGroup;
  }

  async updateGroup(
    no: number,
    data: UpdateGroupDto,
    options?: GroupOptions,
  ): Promise<GroupEntity> {
    this.logger.log(`Updating group with no ${no}`, 'GroupsService');

    this.getGroupByNo(no);
    this.checkGroup(-1, data.username_mentor);

    const updatedGroup = this.prismaService.kelompokOKK.update({
      where: {
        no,
      },
      data,
      include: {
        mentor: options.includeMentor,
        anggota: options.includeAnggota,
        mentoring: options.includeMentoring,
      },
    });

    return updatedGroup;
  }

  async checkGroup(no?: number, usernameMentor?: string): Promise<void> {
    if (no && no !== -1) {
      const group = await this.prismaService.kelompokOKK.findUnique({
        where: {
          no,
        },
      });
      if (!group) {
        throw new NotFoundException(`Group with no ${no} not found`);
      }
    }

    if (usernameMentor) {
      const mentor = await this.prismaService.panitia.findUnique({
        where: {
          username: usernameMentor,
        },
      });
      if (!mentor) {
        throw new BadRequestException(
          `Mentor with username ${usernameMentor} not found`,
        );
      }

      const divisiMentor = await this.prismaService.divisiBPH.findFirst({
        where: {
          nama: 'Mentor',
        },
      });
      if (mentor.divisi_bph_id !== divisiMentor.id) {
        throw new BadRequestException(
          `User with username ${usernameMentor} is not a mentor`,
        );
      }
    }
  }
}
