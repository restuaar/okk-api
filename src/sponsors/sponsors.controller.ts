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
import { SponsorsService } from './sponsors.service';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { LoggerService } from 'src/common/logger/logger.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/interfaces/users.interface';
import { EventSponsorEntity, SponsorEntity } from './entities/sponsor.entity';
import {
  CreateEventSponsorDto,
  CreateSponsorDto,
} from './dto/create-sponsor.dto';
import { UpdateEventSponsorDto } from './dto/update-sponsor.dto';
import { EventEntity } from 'src/events/entities/event.entity';

@ApiTags('Sponsors')
@Controller('sponsors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class SponsorsController {
  constructor(
    private readonly sponsorsService: SponsorsService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.SPONSOR])
  @ApiQuery({ name: 'includeAcara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAkun', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get sponsors',
    type: SponsorEntity,
    isArray: true,
  })
  async getSponsors(
    @Query('includeAcara') includeAcara: boolean = false,
    @Query('includeAkun') includeAkun: boolean = false,
  ) {
    this.logger.log('Get sponsors', 'SponsorsController');

    const options = { includeAcara, includeAkun };
    const sponsors = await this.sponsorsService.getSponsors(options);

    return {
      message: 'Success get sponsors',
      data: sponsors,
    };
  }

  @Get(':username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.SPONSOR])
  @ApiQuery({ name: 'includeAcara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAkun', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get sponsor',
    type: SponsorEntity,
  })
  async getSponsor(
    @Param('username') username: string,
    @Query('includeAcara') includeAcara: boolean = false,
    @Query('includeAkun') includeAkun: boolean = false,
  ) {
    this.logger.log('Get sponsor', 'SponsorsController');

    const options = { includeAcara, includeAkun };
    const sponsor = await this.sponsorsService.getSponsor(username, options);

    return {
      message: 'Success get sponsor',
      data: sponsor,
    };
  }

  @Post()
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.AKUN])
  @ApiResponse({
    description: 'Success create sponsor',
    type: SponsorEntity,
  })
  async createSponsor(@Body() createSponsorDto: CreateSponsorDto) {
    this.logger.log('Create sponsor', 'SponsorsController');

    const sponsor = await this.sponsorsService.createSponsor(createSponsorDto);

    return {
      message: 'Success create sponsor',
      data: sponsor,
    };
  }

  @Patch(':username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.SPONSOR])
  @ApiQuery({ name: 'includeAcara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAkun', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success update sponsor',
    type: SponsorEntity,
  })
  async updateSponsor(
    @Param('username') username: string,
    @Body() updateSponsorDto: CreateSponsorDto,
    @Query('includeAcara') includeAcara: boolean = false,
    @Query('includeAkun') includeAkun: boolean = false,
  ) {
    this.logger.log('Update sponsor', 'SponsorsController');

    const options = { includeAcara, includeAkun };
    const sponsor = await this.sponsorsService.updateSponsor(
      username,
      updateSponsorDto,
      options,
    );

    return {
      message: 'Success update sponsor',
      data: sponsor,
    };
  }

  @Delete(':username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.SPONSOR])
  @ApiParam({ name: 'username', required: true, type: String })
  @ApiQuery({ name: 'includeAcara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAkun', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success delete sponsor',
    type: SponsorEntity,
  })
  async deleteSponsor(
    @Param('username') username: string,
    @Query('includeAcara') includeAcara: boolean = false,
    @Query('includeAkun') includeAkun: boolean = false,
  ) {
    this.logger.log('Delete sponsor', 'SponsorsController');

    const options = { includeAcara, includeAkun };
    const sponsor = await this.sponsorsService.deleteSponsor(username, options);

    return {
      message: 'Success delete sponsor',
      data: sponsor,
    };
  }

  @Post('events')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.SPONSOR])
  @ApiResponse({
    description: 'Success assign event sponsor',
    type: EventSponsorEntity,
  })
  async addEventSponsor(@Body() createEventSponsorDto: CreateEventSponsorDto) {
    this.logger.log('Assign event sponsor', 'SponsorsController');

    const sponsor = await this.sponsorsService.addEventSponsor(
      createEventSponsorDto,
    );

    return {
      message: 'Success assign event sponsor',
      data: sponsor,
    };
  }

  @Patch('events')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.SPONSOR])
  @ApiResponse({
    description: 'Success update event sponsor',
    type: EventSponsorEntity,
  })
  async updateEventSponsor(
    @Body() updateEventSponsorDto: UpdateEventSponsorDto,
  ) {
    this.logger.log('Update event sponsor', 'SponsorsController');

    const sponsor = await this.sponsorsService.updateEventSponsor(
      updateEventSponsorDto,
    );

    return {
      message: 'Success update event sponsor',
      data: sponsor,
    };
  }

  @Delete('events/:id_acara')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiParam({ name: 'id_acara', required: true, type: String })
  @ApiResponse({
    description: 'Success unassign event sponsor',
    type: EventEntity,
  })
  async deleteEventSponsors(@Param('id_acara') id_acara: string) {
    this.logger.log('Unassign event sponsors', 'SponsorsController');

    const sponsor = await this.sponsorsService.removeAllEventSponsor(id_acara);

    return {
      message: 'Success unassign event sponsors',
      data: sponsor,
    };
  }

  @Delete('events/:id_acara/:id_sponsor')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.SPONSOR])
  @ApiParam({ name: 'id_acara', required: true, type: String })
  @ApiParam({ name: 'id_sponsor', required: true, type: String })
  @ApiResponse({
    description: 'Success unassign event sponsor',
    type: SponsorEntity,
  })
  async deleteEventSponsor(
    @Param('id_acara') id_acara: string,
    @Param('id_sponsor') id_sponsor: string,
  ) {
    this.logger.log('Unassign event sponsor', 'SponsorsController');

    const sponsor = await this.sponsorsService.removeEventSponsor(
      id_acara,
      id_sponsor,
    );

    return {
      message: 'Success unassign event sponsor',
      data: sponsor,
    };
  }
}
