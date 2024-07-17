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

@Controller('organizers')
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrganizersController {
  constructor(
    private readonly organizersService: OrganizersService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @Roles([Role.PENGURUS_INTI, Role.PJ])
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
