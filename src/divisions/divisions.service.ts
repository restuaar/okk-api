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

@Injectable()
export class DivisionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getAllPIDivisions(searchDivisionDto: SearchDivisionDto) {
    const { option, onlyPI, onlyBPH, nama, page, size } = searchDivisionDto;

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
          pengurus: option.includePengurus,
          divisiKoor: option.includeDivisi,
        },
      });

      const totalDataPI = await this.prismaService.divisiPI.count({
        where: baseOptions.where,
      });

      return {
        data: divisionsPI,
        page: getPaginationData(page, size, totalDataPI),
      };
    }

    if (onlyBPH) {
      this.logger.log('Fetching BPH Divisions with filters', '');
      const divisionsBPH = await this.prismaService.divisiBPH.findMany({
        ...baseOptions,
        include: {
          panitia: option.includeAnggota,
          divisi_pi: option.includeDivisi,
          rapat_bph: option.includeRapat,
        },
      });

      const totalDataBPH = await this.prismaService.divisiBPH.count({
        where: baseOptions.where,
      });

      return {
        data: divisionsBPH,
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
            pengurus: option.includePengurus,
            divisiKoor: option.includeDivisi,
          },
        }),
        this.prismaService.divisiPI.count({ where: baseOptions.where }),
        this.prismaService.divisiBPH.findMany({
          ...baseOptions,
          include: {
            panitia: option.includeAnggota,
            divisi_pi: option.includeDivisi,
            rapat_bph: option.includeRapat,
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

  async getPIDivision(
    id: string,
    option: { includePengurus: boolean; includeDivisi: boolean } = {
      includePengurus: false,
      includeDivisi: false,
    },
  ) {
    this.logger.log(`Fetching PI Division with id ${id}`);
    const division = await this.prismaService.divisiPI.findUnique({
      where: { id },
      include: {
        pengurus: option.includePengurus,
        divisiKoor: option.includeDivisi,
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

  async getBPHDivision(
    id: string,
    option: {
      includeAnggota: boolean;
      includeDivisi: boolean;
      includeRapat: boolean;
    } = {
      includeAnggota: false,
      includeDivisi: false,
      includeRapat: false,
    },
  ) {
    this.logger.log(`Fetching BPH Division with id ${id}`);
    const division = await this.prismaService.divisiBPH.findUnique({
      where: { id },
      include: {
        panitia: option.includeAnggota,
        divisi_pi: option.includeDivisi,
        rapat_bph: option.includeRapat,
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
    option: { includePengurus: boolean; includeDivisi: boolean } = {
      includePengurus: false,
      includeDivisi: false,
    },
  ) {
    this.logger.log(`Updating PI Division with id ${id}`, 'DivisionsService');
    const division = await this.getPIDivision(id);

    return await this.prismaService.divisiPI.update({
      where: { id },
      data: {
        nama: updatePIDivisionDto.nama ?? division.nama,
      },
      include: {
        pengurus: option.includePengurus,
        divisiKoor: option.includeDivisi,
      },
    });
  }

  async updateBPHDivision(
    id: string,
    updateBPHDivisionDto: CreateBPHDivisionDto,
    option: {
      includeAnggota: boolean;
      includeDivisi: boolean;
      includeRapat: boolean;
    } = {
      includeAnggota: false,
      includeDivisi: false,
      includeRapat: false,
    },
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
        panitia: option.includeAnggota,
        divisi_pi: option.includeDivisi,
        rapat_bph: option.includeRapat,
      },
    });
  }

  async deletePIDivision(id: string) {
    this.logger.log(`Deleting PI Division with id ${id}`, 'DivisionsService');
    const division = await this.getPIDivision(id, {
      includeDivisi: true,
      includePengurus: true,
    });

    await this.prismaService.divisiPI.delete({ where: { id } });

    return division;
  }

  async deleteBPHDivision(id: string) {
    this.logger.log(`Deleting BPH Division with id ${id}`, 'DivisionsService');
    const division = await this.getBPHDivision(id, {
      includeAnggota: true,
      includeDivisi: true,
      includeRapat: true,
    });

    await this.prismaService.divisiBPH.delete({ where: { id } });

    return division;
  }
}
