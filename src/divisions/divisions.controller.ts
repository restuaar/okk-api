import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import {
  CreateBPHDivisionDto,
  CreatePIDivisionDto,
} from './dto/create-division.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/interfaces/users.interface';
import { UpdateDivisionPIDto } from './dto/update-division.dto';
import { LoggerService } from 'src/common/logger/logger.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DivisionBPH, DivisionPI } from './entities/division.entity';

@ApiTags('Divisions')
@ApiBearerAuth()
@Controller('divisions')
@UseGuards(JwtAuthGuard, RoleGuard)
export class DivisionsController {
  constructor(
    private readonly divisionsService: DivisionsService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiQuery({ name: 'nama', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'onlyPI', required: false, type: Boolean })
  @ApiQuery({ name: 'onlyBPH', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Success get divisions',
    type: () => [DivisionPI, DivisionBPH],
    isArray: true,
  })
  async getDivisions(
    @Query('nama') nama: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('onlyPI', new ParseBoolPipe({ optional: true })) onlyPI: boolean,
    @Query('onlyBPH', new ParseBoolPipe({ optional: true })) onlyBPH: boolean,
    @Query('includePengurus', new ParseBoolPipe({ optional: true }))
    includePengurus: boolean,
    @Query('includeAnggota', new ParseBoolPipe({ optional: true }))
    includeAnggota: boolean,
    @Query('includeDivisi', new ParseBoolPipe({ optional: true }))
    includeDivisi: boolean,
    @Query('includeRapat', new ParseBoolPipe({ optional: true }))
    includeRapat: boolean,
  ) {
    this.logger.log('Fetching divisions', 'DivisionsController');
    const searchDivisionDto = { nama, page, size, onlyPI, onlyBPH };
    const options = {
      PI: { includePengurus, includeDivisi },
      BPH: { includeAnggota, includeDivisi, includeRapat },
    };
    const divisions = await this.divisionsService.searchDivisions(
      searchDivisionDto,
      options,
    );

    return {
      message: 'Get divisions success',
      data: divisions,
    };
  }

  @Get('/pi')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiQuery({ name: 'nama', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'includePengurus', required: false, type: Boolean })
  @ApiQuery({ name: 'includeDivisi', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Success get PI divisions',
    type: DivisionPI,
    isArray: true,
  })
  async getPIDivisions(
    @Query('nama') nama: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('includePengurus', new ParseBoolPipe({ optional: true }))
    includePengurus: boolean = true,
    @Query('includeDivisi', new ParseBoolPipe({ optional: true }))
    includeDivisi: boolean = false,
  ) {
    this.logger.log('Fetching PI divisions', 'DivisionsController');
    const searchDivisionDto = { nama, page, size };
    const options = { includePengurus, includeDivisi };
    const divisions = await this.divisionsService.getPIDivisions(
      searchDivisionDto,
      options,
    );

    return {
      message: 'Get PI divisions success',
      data: divisions,
    };
  }

  @Get('/pi/:id')
  @Roles([Role.PENGURUS_INTI])
  @ApiQuery({ name: 'includePengurus', required: false, type: Boolean })
  @ApiQuery({ name: 'includeDivisi', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Success get PI Division',
    type: DivisionPI,
  })
  async getPIDivision(
    @Param('id') id: string,
    @Query('includePengurus', new ParseBoolPipe({ optional: true }))
    includePengurus: boolean = true,
    @Query('includeDivisi', new ParseBoolPipe({ optional: true }))
    includeDivisi: boolean = false,
  ) {
    this.logger.log(
      `Fetching PI Division with id ${id}`,
      'DivisionsController',
    );
    const division = await this.divisionsService.getPIDivision(id, {
      includePengurus,
      includeDivisi,
    });
    return {
      message: 'Get PI Division success',
      data: division,
    };
  }

  @Get('/bph')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiQuery({ name: 'nama', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'includeAnggota', required: false, type: Boolean })
  @ApiQuery({ name: 'includeDivisi', required: false, type: Boolean })
  @ApiQuery({ name: 'includeRapat', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Success get BPH divisions',
    type: DivisionBPH,
    isArray: true,
  })
  async getBPHDivisions(
    @Query('nama') nama: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('includeAnggota', new ParseBoolPipe({ optional: true }))
    includeAnggota: boolean = false,
    @Query('includeDivisi', new ParseBoolPipe({ optional: true }))
    includeDivisi: boolean = false,
    @Query('includeRapat', new ParseBoolPipe({ optional: true }))
    includeRapat: boolean = false,
  ) {
    this.logger.log('Fetching BPH divisions', 'DivisionsController');
    const searchDivisionDto = { nama, page, size };
    const options = { includeAnggota, includeDivisi, includeRapat };
    const divisions = await this.divisionsService.getBPHDivisions(
      searchDivisionDto,
      options,
    );

    return {
      message: 'Get BPH divisions success',
      data: divisions,
    };
  }

  @Get('/bph/:id')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiQuery({ name: 'includeAnggota', required: false, type: Boolean })
  @ApiQuery({ name: 'includeDivisi', required: false, type: Boolean })
  @ApiQuery({ name: 'includeRapat', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Success get BPH Division',
    type: DivisionBPH,
  })
  async getBPHDivision(
    @Param('id') id: string,
    @Query('includeAnggota', new ParseBoolPipe({ optional: true }))
    includeAnggota: boolean = false,
    @Query('includeDivisi', new ParseBoolPipe({ optional: true }))
    includeDivisi: boolean = false,
    @Query('includeRapat', new ParseBoolPipe({ optional: true }))
    includeRapat: boolean = false,
  ) {
    this.logger.log(
      `Fetching BPH Division with id ${id}`,
      'DivisionsController',
    );
    const division = await this.divisionsService.getBPHDivision(id, {
      includeAnggota,
      includeDivisi,
      includeRapat,
    });

    return {
      message: 'Get BPH Division success',
      data: division,
    };
  }

  @Post('/pi')
  @Roles([Role.PENGURUS_INTI])
  @ApiCreatedResponse({
    description: 'Success create PI Division',
    type: DivisionPI,
  })
  async createPIDivision(@Body() createDivisionPIDto: CreatePIDivisionDto) {
    this.logger.log('Creating new PI Division', 'DivisionsController');
    const division =
      await this.divisionsService.createPIDivision(createDivisionPIDto);

    return {
      message: 'Create PI Division success',
      data: division,
    };
  }

  @Post('/bph')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiCreatedResponse({
    description: 'Success create BPH Division',
    type: DivisionBPH,
  })
  async createBPHDivision(@Body() createDivisionBPHDto: CreateBPHDivisionDto) {
    this.logger.log('Creating new BPH Division', 'DivisionsController');
    const division =
      await this.divisionsService.createBPHDivision(createDivisionBPHDto);

    return {
      message: 'Create BPH Division success',
      data: division,
    };
  }

  @Patch('/pi/:id')
  @Roles([Role.PENGURUS_INTI])
  @ApiQuery({ name: 'includeDivisi', required: false, type: Boolean })
  @ApiQuery({ name: 'includePengurus', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Success update PI Division',
    type: DivisionPI,
  })
  async updatePIDivision(
    @Param('id') id: string,
    @Body() updateDivisionPIDto: UpdateDivisionPIDto,
    @Query('includePengurus', new ParseBoolPipe({ optional: true }))
    includePengurus: boolean = true,
    @Query('includeDivisi', new ParseBoolPipe({ optional: true }))
    includeDivisi: boolean = false,
  ) {
    this.logger.log(
      `Updating PI Division with id ${id}`,
      'DivisionsController',
    );
    const division = await this.divisionsService.updatePIDivision(
      id,
      updateDivisionPIDto,
      { includePengurus, includeDivisi },
    );

    return {
      message: 'Update PI Division success',
      data: division,
    };
  }

  @Patch('/bph/:id')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiQuery({ name: 'includeAnggota', required: false, type: Boolean })
  @ApiQuery({ name: 'includeDivisi', required: false, type: Boolean })
  @ApiQuery({ name: 'includeRapat', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Success update BPH Division',
    type: DivisionBPH,
  })
  async updateBPHDivision(
    @Param('id') id: string,
    @Body() updateDivisionBPHDto: CreateBPHDivisionDto,
    @Query('includeAnggota', new ParseBoolPipe({ optional: true }))
    includeAnggota: boolean = false,
    @Query('includeDivisi', new ParseBoolPipe({ optional: true }))
    includeDivisi: boolean = false,
    @Query('includeRapat', new ParseBoolPipe({ optional: true }))
    includeRapat: boolean = false,
  ) {
    this.logger.log(
      `Updating BPH Division with id ${id}`,
      'DivisionsController',
    );
    const division = await this.divisionsService.updateBPHDivision(
      id,
      updateDivisionBPHDto,
      { includeAnggota, includeDivisi, includeRapat },
    );

    return {
      message: 'Update BPH Division success',
      data: division,
    };
  }

  @Delete('/pi/:id')
  @Roles([Role.PENGURUS_INTI])
  @ApiQuery({ name: 'includeDivisi', required: false, type: Boolean })
  @ApiQuery({ name: 'includePengurus', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Success delete PI Division',
    type: DivisionPI,
  })
  async deletePIDivision(
    @Param('id') id: string,
    @Query('includePengurus', new ParseBoolPipe({ optional: true }))
    includePengurus: boolean = true,
    @Query('includeDivisi', new ParseBoolPipe({ optional: true }))
    includeDivisi: boolean = false,
  ) {
    this.logger.log(
      `Deleting PI Division with id ${id}`,
      'DivisionsController',
    );
    const division = await this.divisionsService.deletePIDivision(id, {
      includePengurus,
      includeDivisi,
    });

    return {
      message: 'Delete PI Division success',
      data: division,
    };
  }

  @Delete('/bph/:id')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiQuery({ name: 'includeAnggota', required: false, type: Boolean })
  @ApiQuery({ name: 'includeDivisi', required: false, type: Boolean })
  @ApiQuery({ name: 'includeRapat', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Success delete BPH Division',
    type: DivisionBPH,
  })
  async deleteBPHDivision(
    @Param('id') id: string,
    @Query('includeAnggota', new ParseBoolPipe({ optional: true }))
    includeAnggota: boolean = false,
    @Query('includeDivisi', new ParseBoolPipe({ optional: true }))
    includeDivisi: boolean = false,
    @Query('includeRapat', new ParseBoolPipe({ optional: true }))
    includeRapat: boolean = false,
  ) {
    this.logger.log(
      `Deleting BPH Division with id ${id}`,
      'DivisionsController',
    );
    const division = await this.divisionsService.deleteBPHDivision(id, {
      includeAnggota,
      includeDivisi,
      includeRapat,
    });

    return {
      message: 'Delete BPH Division success',
      data: division,
    };
  }
}
