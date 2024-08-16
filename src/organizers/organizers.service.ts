import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { SearchOrganizerDto } from './dto/search-organizer.dto';
import { getPaginationData } from 'src/utils/get-pagination';
import { Page } from 'src/dto/success.dto';
import { OrganizerEntity } from './entities/organizer.entity';
import { Panitia } from '@prisma/client';
import { OrganizerOptions } from 'src/interfaces/options.interface';

@Injectable()
export class OrganizersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async searchOrganizers(
    searchOrganierDto: SearchOrganizerDto,
    options?: OrganizerOptions,
  ): Promise<{ organizers: OrganizerEntity[]; page: Page }> {
    this.logger.log('Search organizers', 'OrganizersService');

    const {
      nama,
      divisi_id,
      jabatan,
      fakultas,
      jurusan,
      angkatan,
      page,
      size,
    } = searchOrganierDto;

    const filterOptions = {
      AND: [
        { akun: { nama: { contains: nama } } },
        divisi_id
          ? {
              OR: [{ divisi_pi_id: divisi_id }, { divisi_bph_id: divisi_id }],
            }
          : {},
        jabatan ? { jabatan: { equals: jabatan } } : {},
        { fakultas: { contains: fakultas } },
        { jurusan: { contains: jurusan } },
        angkatan ? { angkatan } : {},
      ],
    };

    const [result, totalData] = await Promise.all([
      this.prismaService.panitia.findMany({
        where: filterOptions,
        include: {
          divisi_bph: options.includeDivisi,
          divisi_pi: options.includeDivisi,
          hadirRapatBPH: options.includeRapat,
        },
        skip: (page - 1) * size,
        take: size,
      }),
      this.prismaService.panitia.count({
        where: filterOptions,
      }),
    ]);

    return {
      organizers: result,
      page: getPaginationData(page, size, totalData),
    };
  }

  async getOrganizer(
    username: string,
    options?: OrganizerOptions,
  ): Promise<OrganizerEntity> {
    this.logger.log(`Get organizer ${username}`, 'OrganizersService');

    const organizer = await this.checkOrganizer(username);
    if (organizer.divisi_pi_id && options.includeRapat) {
      throw new BadRequestException('Cannot include rapat for PI division');
    }

    const includeOptions = organizer.divisi_pi_id
      ? { divisi_pi: options.includeDivisi }
      : {
          divisi_bph: options.includeDivisi,
          hadirRapatBPH: options.includeRapat,
        };

    const organizerOption = await this.prismaService.panitia.findUnique({
      where: { username },
      include: includeOptions,
    });

    return organizerOption;
  }

  async createOrganizer(
    createOrganizerDto: CreateOrganizerDto,
  ): Promise<OrganizerEntity> {
    this.logger.log('Create organizer', 'OrganizersService');

    this.validateInput(createOrganizerDto, false);
    this.checkAkun(createOrganizerDto.username);

    return await this.prismaService.panitia.create({
      data: createOrganizerDto,
    });
  }

  async updateOrganizer(
    username: string,
    updateOrganizerDto: UpdateOrganizerDto,
    options?: OrganizerOptions,
  ): Promise<OrganizerEntity> {
    this.logger.log(`Update organizer ${username}`, 'OrganizersService');

    this.validateInput(updateOrganizerDto, options.includeRapat);

    const {
      username: updateUsername,
      fakultas,
      jurusan,
      angkatan,
      divisi_bph_id,
      divisi_pi_id,
      jabatan,
    } = updateOrganizerDto;

    const organizer = await this.checkOrganizer(username);

    return await this.prismaService.panitia.update({
      where: { username },
      data: {
        username: updateUsername ?? organizer.username,
        fakultas: fakultas ?? organizer.fakultas,
        jurusan: jurusan ?? organizer.jurusan,
        angkatan: angkatan ?? organizer.angkatan,
        divisi_bph_id: divisi_bph_id ?? organizer.divisi_bph_id,
        divisi_pi_id: divisi_pi_id ?? organizer.divisi_pi_id,
        jabatan: jabatan ?? organizer.jabatan,
      },
      include: {
        divisi_bph: options.includeDivisi,
        divisi_pi: options.includeDivisi,
        hadirRapatBPH: options.includeRapat,
      },
    });
  }

  async deleteOrganizer(
    username: string,
    options?: OrganizerOptions,
  ): Promise<OrganizerEntity> {
    this.logger.log(`Delete organizer ${username}`, 'OrganizersService');

    const organizer = await this.checkOrganizer(username);
    this.validateInput(organizer, options.includeRapat);

    return await this.prismaService.panitia.delete({
      where: { username },
      include: {
        divisi_bph: options.includeDivisi,
        divisi_pi: options.includeDivisi,
        hadirRapatBPH: options.includeRapat,
      },
    });
  }

  async checkOrganizer(username: string): Promise<Panitia> {
    const organizer = await this.prismaService.panitia.findUnique({
      where: { username },
    });

    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    return organizer;
  }

  async checkAkun(username: string) {
    const akun = await this.prismaService.akun.findUnique({
      where: { username },
    });

    if (!akun) {
      throw new NotFoundException('Akun not found');
    }
  }

  validateInput(
    organizerDto: UpdateOrganizerDto | CreateOrganizerDto,
    includeRapat: boolean,
  ): void {
    const { divisi_pi_id, divisi_bph_id } = organizerDto;

    if (divisi_pi_id && divisi_bph_id) {
      throw new BadRequestException(
        'Cannot assign PI and BPH division at the same time',
      );
    }

    if (!divisi_pi_id && !divisi_bph_id) {
      throw new BadRequestException(
        'Please assign PI or BPH division to the organizer',
      );
    }

    if (divisi_pi_id && includeRapat) {
      throw new BadRequestException('Cannot include rapat for PI division');
    }
  }
}
