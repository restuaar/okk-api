import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenteesService } from './mentees.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/interfaces/users.interface';
import { SearchMenteeDto } from './dto/searh-mentee.dto';
import { MenteeEntity } from './entities/mentee.entity';
import { CreateMenteeDto } from './dto/create-mentee.dto';

@ApiTags('Mentees')
@Controller('mentees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class MenteesController {
  constructor(
    private readonly menteesService: MenteesService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA, Role.MENTEE])
  @ApiQuery({ name: 'nama', required: false, type: String })
  @ApiQuery({ name: 'fakultas', required: false, type: String })
  @ApiQuery({ name: 'jurusan', required: false, type: String })
  @ApiQuery({ name: 'angkatan', required: false, type: Number })
  @ApiQuery({ name: 'includeAkun', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({
    description: 'Success get mentees',
    type: MenteeEntity,
    isArray: true,
  })
  async searchMentee(
    @Query() searchQuery: SearchMenteeDto,
    @Query('includeAkun') includeAkun: boolean = false,
    @Query('includeMentoring') includeMentoring: boolean = false,
    @Query('includeGroup') includeGroup: boolean = false,
  ) {
    this.logger.log('Search mentees', 'MenteesController');
    const options = { includeAkun, includeMentoring, includeGroup };
    searchQuery.page = searchQuery.page || 1;
    searchQuery.size = searchQuery.size || 10;
    const result = await this.menteesService.searchMentees(
      searchQuery,
      options,
    );

    return {
      message: 'Success get mentees',
      data: result.mentees,
      page: result.page,
    };
  }

  @Get('/:username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA, Role.MENTEE])
  @ApiQuery({ name: 'includeAkun', required: false, type: Boolean })
  @ApiQuery({ name: 'includeMentoring', required: false, type: Boolean })
  @ApiQuery({ name: 'includeGroup', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get mentee',
    type: MenteeEntity,
  })
  async getMentee(
    @Query('username') username: string,
    @Query('includeAkun') includeAkun: boolean = false,
    @Query('includeMentoring') includeMentoring: boolean = false,
    @Query('includeGroup') includeGroup: boolean = false,
  ) {
    this.logger.log('Get mentee', 'MenteesController');
    const options = { includeAkun, includeMentoring, includeGroup };
    const result = await this.menteesService.getMentee(username, options);

    return {
      message: 'Success get mentee',
      data: result,
    };
  }

  @Post()
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiResponse({
    description: 'Success create mentee',
    type: MenteeEntity,
  })
  async createMentee(@Body() createMenteeDto: CreateMenteeDto) {
    this.logger.log('Create mentee', 'MenteesController');
    const result = await this.menteesService.createMentee(createMenteeDto);

    return {
      message: 'Success create mentee',
      data: result,
    };
  }

  @Patch('/:username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA, Role.MENTEE])
  @ApiResponse({
    description: 'Success update mentee',
    type: MenteeEntity,
  })
  async updateMentee(
    @Query('username') username: string,
    @Body() updateMenteeDto: CreateMenteeDto,
    @Query('includeAkun') includeAkun: boolean = false,
    @Query('includeMentoring') includeMentoring: boolean = false,
    @Query('includeGroup') includeGroup: boolean = false,
  ) {
    this.logger.log('Update mentee', 'MenteesController');
    const options = { includeAkun, includeMentoring, includeGroup };
    const result = await this.menteesService.updateMentee(
      username,
      updateMenteeDto,
      options,
    );

    return {
      message: 'Success update mentee',
      data: result,
    };
  }

  @Delete('/:username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiResponse({
    description: 'Success delete mentee',
    type: MenteeEntity,
  })
  async deleteMentee(
    @Query('username') username: string,
    @Query('includeAkun') includeAkun: boolean = false,
    @Query('includeMentoring') includeMentoring: boolean = false,
    @Query('includeGroup') includeGroup: boolean = false,
  ) {
    this.logger.log('Delete mentee', 'MenteesController');
    const options = { includeAkun, includeMentoring, includeGroup };
    const result = await this.menteesService.deleteMentee(username, options);

    return {
      message: 'Success delete mentee',
      data: result,
    };
  }
}
