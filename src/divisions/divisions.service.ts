import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { LoggerService } from 'src/common/logger/logger.service';
import {
  CreateBPHDivisionDto,
  CreatePIDivisionDto,
} from './dto/create-division.dto';
import { v6 as uuidv6 } from 'uuid';
import { UpdateDivisionPIDto } from './dto/update-division.dto';
import { SearchDivisionDto } from './dto/search-division.dto';
import { getPaginationData } from 'src/utils/get-pagination';
import { Page } from 'src/dto/success.dto';
import { DivisionBPH, DivisionPI } from './entities/division.entity';
import { TipeJabatan } from '@prisma/client';
import {
  BPHDivisionOptions,
  PIDivisionOptions,
  SearchDivisionOptions,
} from 'src/interfaces/options.interface';

@Injectable()
export class DivisionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async searchDivisions(
    searchDivisionDto: SearchDivisionDto,
    options: SearchDivisionOptions,
  ): Promise<{
    data: {
      divisi_pi?: DivisionPI[];
      divisi_bph?: DivisionBPH[];
    };
    page: Page | { divisi_pi: Page; divisi_bph: Page };
  }> {
    const { onlyPI, onlyBPH, nama, page, size } = searchDivisionDto;
    const { PI, BPH } = options;

    if (onlyPI && onlyBPH) {
      this.logger.warn(
        'Invalid search options: onlyPI and onlyBPH both set',
        'DivisionsService',
      );
      throw new BadRequestException(
        'Only allowed to search one type of division or not at all',
      );
    }

    const baseOptions = {
      where: { nama: { contains: nama } },
      skip: (page - 1) * size,
      take: size,
    };

    if (onlyPI) {
      this.logger.log('Fetching PI Divisions with filters', 'DivisionsService');
      const divisionsPI = await this.prismaService.divisiPI.findMany({
        ...baseOptions,
        include: {
          pengurus: PI.includePengurus,
          divisiKoor: PI.includeDivisi,
        },
      });

      const totalDataPI = await this.prismaService.divisiPI.count({
        where: baseOptions.where,
      });

      return {
        data: {
          divisi_pi: divisionsPI,
        },
        page: getPaginationData(page, size, totalDataPI),
      };
    }

    if (onlyBPH) {
      this.logger.log(
        'Fetching BPH Divisions with filters',
        'DivisionsService',
      );
      const divisionsBPH = await this.prismaService.divisiBPH.findMany({
        ...baseOptions,
        include: {
          panitia: BPH.includeAnggota,
          divisi_pi: BPH.includeDivisi,
          rapat_bph: BPH.includeRapat,
        },
      });

      const totalDataBPH = await this.prismaService.divisiBPH.count({
        where: baseOptions.where,
      });

      return {
        data: {
          divisi_bph: divisionsBPH,
        },
        page: getPaginationData(page, size, totalDataBPH),
      };
    }

    this.logger.log(
      'Fetching all PI and BPH Divisions with filters',
      'DivisionsService',
    );
    const [divisionsPI, totalDataPI, divisionsBPH, totalDataBPH] =
      await Promise.all([
        this.prismaService.divisiPI.findMany({
          ...baseOptions,
          include: {
            pengurus: PI.includePengurus,
            divisiKoor: PI.includeDivisi,
          },
        }),
        this.prismaService.divisiPI.count({ where: baseOptions.where }),
        this.prismaService.divisiBPH.findMany({
          ...baseOptions,
          include: {
            panitia: BPH.includeAnggota,
            divisi_pi: BPH.includeDivisi,
            rapat_bph: BPH.includeRapat,
          },
        }),
        this.prismaService.divisiBPH.count({ where: baseOptions.where }),
      ]);

    return {
      data: {
        divisi_pi: divisionsPI,
        divisi_bph: divisionsBPH,
      },
      page: {
        divisi_pi: getPaginationData(page, size, totalDataPI),
        divisi_bph: getPaginationData(page, size, totalDataBPH),
      },
    };
  }

  async getPIDivisions(
    searchDto: SearchDivisionDto,
    options: PIDivisionOptions,
  ): Promise<{
    data: DivisionPI[];
    page: Page;
  }> {
    this.logger.log('Fetching all PI Divisions', 'DivisionsService');
    const piDivision = await this.prismaService.divisiPI.findMany({
      where: {
        nama: { contains: searchDto.nama },
      },
      include: {
        pengurus: options.includePengurus,
        divisiKoor: options.includeDivisi,
      },
      take: searchDto.size,
      skip: (searchDto.page - 1) * searchDto.size,
    });
    const totalData = await this.prismaService.divisiPI.count({
      where: { nama: { contains: searchDto.nama } },
    });
    return {
      data: piDivision,
      page: getPaginationData(searchDto.page, searchDto.size, totalData),
    };
  }

  async getPIDivision(
    id: string,
    options: PIDivisionOptions,
  ): Promise<DivisionPI> {
    this.logger.log(`Fetching PI Division with id ${id}`);
    const division = await this.prismaService.divisiPI.findUnique({
      where: { id },
      include: {
        pengurus: options.includePengurus,
        divisiKoor: options.includeDivisi,
      },
    });

    if (!division) {
      this.logger.warn(
        `PI Division with id ${id} not found`,
        'DivisionsService',
      );
      throw new NotFoundException(`Division with id ${id} not found`);
    }

    return division;
  }

  async getBPHDivisions(
    searchDto: SearchDivisionDto,
    options: BPHDivisionOptions,
  ): Promise<{
    data: DivisionBPH[];
    page: Page;
  }> {
    this.logger.log('Fetching all PI Divisions', 'DivisionsService');
    const bphDivisions = await this.prismaService.divisiBPH.findMany({
      where: {
        nama: { contains: searchDto.nama },
      },
      include: {
        divisi_pi: options.includeDivisi,
        panitia: options.includeAnggota,
        rapat_bph: options.includeRapat,
      },
      take: searchDto.size,
      skip: (searchDto.page - 1) * searchDto.size,
    });
    const totalData = await this.prismaService.divisiBPH.count({
      where: { nama: { contains: searchDto.nama } },
    });
    return {
      data: bphDivisions,
      page: getPaginationData(searchDto.page, searchDto.size, totalData),
    };
  }

  async getBPHDivision(id: string, options: BPHDivisionOptions) {
    this.logger.log(`Fetching BPH Division with id ${id}`);
    const division = await this.prismaService.divisiBPH.findUnique({
      where: { id },
      include: {
        panitia: options.includeAnggota,
        divisi_pi: options.includeDivisi,
        rapat_bph: options.includeRapat,
      },
    });

    if (!division) {
      this.logger.warn(
        `BPH Division with id ${id} not found`,
        'DivisionsService',
      );
      throw new NotFoundException(`Division with id ${id} not found`);
    }

    return division;
  }

  async createPIDivision(createPIDivisionDto: CreatePIDivisionDto) {
    this.logger.log('Creating new PI Division', 'DivisionsService');
    return await this.prismaService.divisiPI.create({
      data: {
        id: uuidv6(),
        ...createPIDivisionDto,
      },
    });
  }

  async createBPHDivision(createBPHDivisionDto: CreateBPHDivisionDto) {
    this.logger.log('Creating new BPH Division', 'DivisionsService');
    return await this.prismaService.divisiBPH.create({
      data: {
        id: uuidv6(),
        ...createBPHDivisionDto,
      },
    });
  }

  async updatePIDivision(
    id: string,
    updatePIDivisionDto: UpdateDivisionPIDto,
    options: PIDivisionOptions,
  ) {
    this.logger.log(`Updating PI Division with id ${id}`, 'DivisionsService');
    const division = await this.getPIDivision(id, {
      includeDivisi: false,
      includePengurus: false,
    });
    const currentPengurus = await this.prismaService.panitia.findUnique({
      where: { username: division.pengurus.username },
    });

    if (updatePIDivisionDto.username_pengurus) {
      const newPengurus = await this.prismaService.panitia.findUnique({
        where: { username: updatePIDivisionDto.username_pengurus },
      });

      if (!newPengurus) {
        throw new BadRequestException('Pengurus doesnt exist');
      }

      if (newPengurus.divisi_pi_id) {
        throw new BadRequestException('Pengurus already has a division');
      }

      await this.prismaService.panitia.update({
        where: { username: division.pengurus.username },
        data: { jabatan: TipeJabatan.PENGURUS_INTI },
      });
    }

    return await this.prismaService.divisiPI.update({
      where: { id },
      data: {
        nama: updatePIDivisionDto.nama ?? division.nama,
        pengurus: {
          connect: {
            username:
              updatePIDivisionDto.username_pengurus ?? currentPengurus.username,
          },
        },
      },
      include: {
        pengurus: options.includePengurus,
        divisiKoor: options.includeDivisi,
      },
    });
  }

  async updateBPHDivision(
    id: string,
    updateBPHDivisionDto: CreateBPHDivisionDto,
    options: BPHDivisionOptions,
  ) {
    this.logger.log(`Updating BPH Division with id ${id}`, 'DivisionsService');
    const division = await this.prismaService.divisiBPH.findUnique({
      where: { id },
    });

    if (!division) {
      this.logger.warn(
        `BPH Division with id ${id} not found`,
        'DivisionsService',
      );
      throw new NotFoundException(`Division with id ${id} not found`);
    }

    return await this.prismaService.divisiBPH.update({
      where: { id },
      data: {
        nama: updateBPHDivisionDto.nama ?? division.nama,
        divisi_bagian:
          updateBPHDivisionDto.divisi_bagian ?? division.divisi_bagian,
      },
      include: {
        panitia: options.includeAnggota,
        divisi_pi: options.includeDivisi,
        rapat_bph: options.includeRapat,
      },
    });
  }

  async deletePIDivision(id: string, options: PIDivisionOptions) {
    this.logger.log(`Deleting PI Division with id ${id}`, 'DivisionsService');
    const division = await this.getPIDivision(id, options);

    await this.prismaService.divisiPI.delete({ where: { id } });

    return division;
  }

  async deleteBPHDivision(id: string, options: BPHDivisionOptions) {
    this.logger.log(`Deleting BPH Division with id ${id}`, 'DivisionsService');
    const division = await this.getBPHDivision(id, options);

    await this.prismaService.divisiBPH.delete({ where: { id } });

    return division;
  }
}
