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
import { Role } from 'src/interfaces/user.interface';
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

  @Get('/pi/:id')
  @Roles([Role.PENGURUS_INTI])
  @ApiOkResponse({
    description: 'Success get PI Division',
    type: DivisionPI,
  })
  async getPIDivision(@Param('id') id: string) {
    this.logger.log(
      `Fetching PI Division with id ${id}`,
      'DivisionsController',
    );
    const division = await this.divisionsService.getPIDivision(id);
    return {
      message: 'Get PI Division success',
      data: division,
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
    includePengurus: boolean = false,
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
  @ApiOkResponse({
    description: 'Success delete PI Division',
    type: DivisionPI,
  })
  async deletePIDivision(@Param('id') id: string) {
    this.logger.log(
      `Deleting PI Division with id ${id}`,
      'DivisionsController',
    );
    const division = await this.divisionsService.deletePIDivision(id);

    return {
      message: 'Delete PI Division success',
      data: division,
    };
  }

  @Delete('/bph/:id')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiOkResponse({
    description: 'Success delete BPH Division',
    type: DivisionBPH,
  })
  async deleteBPHDivision(@Param('id') id: string) {
    this.logger.log(
      `Deleting BPH Division with id ${id}`,
      'DivisionsController',
    );
    const division = await this.divisionsService.deleteBPHDivision(id);

    return {
      message: 'Delete BPH Division success',
      data: division,
    };
  }
}
