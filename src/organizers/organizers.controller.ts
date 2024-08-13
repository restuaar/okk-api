import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/interfaces/users.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { SearchOrganizerDto } from './dto/search-organizer.dto';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizerEntity } from './entities/organizer.entity';

@ApiTags('Organizers')
@Controller('organizers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrganizersController {
  constructor(
    private readonly organizersService: OrganizersService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'includeRapat', required: false })
  @ApiQuery({ name: 'includeDivisi', required: false })
  @ApiResponse({
    description: 'Success get organizers',
    type: OrganizerEntity,
    isArray: true,
  })
  async searchOrganizer(
    @Query() searchQuery: SearchOrganizerDto,
    @Query('includeRapat') includeRapat: boolean = false,
    @Query('includeDivisi') includeDivisi: boolean = false,
  ) {
    this.logger.log('Search organizers', 'OrganizersController');
    const options = { includeRapat, includeDivisi };
    searchQuery.page = searchQuery.page || 1;
    searchQuery.size = searchQuery.size || 10;
    const result = await this.organizersService.searchOrganizers(
      searchQuery,
      options,
    );

    return {
      message: 'Success get organizers',
      data: result.organizers,
      page: result.page,
    };
  }

  @Get('/:username')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiParam({ name: 'username', required: true })
  @ApiQuery({ name: 'includeRapat', required: false })
  @ApiQuery({ name: 'includeDivisi', required: false })
  @ApiResponse({
    description: 'Success get organizer',
    type: OrganizerEntity,
  })
  async getOrganizer(
    @Param('username') username: string,
    @Query('includeRapat') includeRapat: boolean = false,
    @Query('includeDivisi') includeDivisi: boolean = false,
  ) {
    this.logger.log('Get organizer', 'OrganizersController');

    const options = { includeRapat, includeDivisi };
    const organizer = await this.organizersService.getOrganizer(
      username,
      options,
    );

    return {
      message: 'Success get organizer',
      data: organizer,
    };
  }

  @Post()
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiResponse({
    description: 'Success create organizer',
    type: OrganizerEntity,
  })
  async createOrganizer(@Body() createOrganizerDto: CreateOrganizerDto) {
    this.logger.log('Create organizer', 'OrganizersController');
    const organizer =
      await this.organizersService.createOrganizer(createOrganizerDto);

    return {
      message: 'Success create organizer',
      data: organizer,
    };
  }

  @Patch('/:username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'username', required: true })
  @ApiQuery({ name: 'includeRapat', required: false })
  @ApiQuery({ name: 'includeDivisi', required: false })
  @ApiResponse({
    description: 'Success update organizer',
    type: OrganizerEntity,
  })
  async updateOrganizer(
    @Param('username') username: string,
    @Body() updateOrganizerDto: CreateOrganizerDto,
    @Query('includeRapat') includeRapat: boolean = false,
    @Query('includeDivisi') includeDivisi: boolean = false,
  ) {
    this.logger.log('Update organizer', 'OrganizersController');

    const options = { includeRapat, includeDivisi };
    const organizer = await this.organizersService.updateOrganizer(
      username,
      updateOrganizerDto,
      options,
    );

    return {
      message: 'Success update organizer',
      data: organizer,
    };
  }

  @Delete('/:username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'username', required: true })
  @ApiQuery({ name: 'includeRapat', required: false })
  @ApiQuery({ name: 'includeDivisi', required: false })
  @ApiResponse({
    description: 'Success delete organizer',
    type: OrganizerEntity,
  })
  async deleteOrganizer(
    @Param('username') username: string,
    @Query('includeRapat') includeRapat: boolean = false,
    @Query('includeDivisi') includeDivisi: boolean = false,
  ) {
    this.logger.log('Delete organizer', 'OrganizersController');

    const options = { includeRapat, includeDivisi };
    const organizer = await this.organizersService.deleteOrganizer(
      username,
      options,
    );

    return {
      message: 'Success delete organizer',
      data: organizer,
    };
  }
}
