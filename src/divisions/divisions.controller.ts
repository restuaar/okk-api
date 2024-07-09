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

@Controller('divisions')
@UseGuards(JwtAuthGuard, RoleGuard)
export class DivisionsController {
  constructor(
    private readonly divisionsService: DivisionsService,
    private readonly logger: LoggerService,
  ) {}

  // Endpoint to get a single PI Division by id
  @Get('/pi/:id')
  @Roles([Role.PENGURUS_INTI])
  async getPIDivision(
    @Param('id') id: string,
    @Query('includePengurus', new ParseBoolPipe({ optional: true }))
    includePengurus: boolean = false,
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

  // Endpoint to get a single BPH Division by id
  @Get('/bph/:id')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
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

  // Endpoint to create a new PI Division
  @Post('/pi')
  @Roles([Role.PENGURUS_INTI])
  async createPIDivision(@Body() createDivisionPIDto: CreatePIDivisionDto) {
    this.logger.log('Creating new PI Division', 'DivisionsController');
    const division =
      await this.divisionsService.createPIDivision(createDivisionPIDto);

    return {
      message: 'Create PI Division success',
      data: division,
    };
  }

  // Endpoint to create a new BPH Division
  @Post('/bph')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  async createBPHDivision(@Body() createDivisionBPHDto: CreateBPHDivisionDto) {
    this.logger.log('Creating new BPH Division', 'DivisionsController');
    const division =
      await this.divisionsService.createBPHDivision(createDivisionBPHDto);

    return {
      message: 'Create BPH Division success',
      data: division,
    };
  }

  // Endpoint to update a PI Division by id
  @Patch('/pi/:id')
  @Roles([Role.PENGURUS_INTI])
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

  // Endpoint to update a BPH Division by id
  @Patch('/bph/:id')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
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

  // Endpoint to delete a PI Division by id
  @Delete('/pi/:id')
  @Roles([Role.PENGURUS_INTI])
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

  // Endpoint to delete a BPH Division by id
  @Delete('/bph/:id')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
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
