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
import { EventsService } from './events.service';
import { LoggerService } from 'src/common/logger/logger.service';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/interfaces/users.interface';
import { SearchEventDto } from './dto/search-event.dto';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('Events')
@Controller('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PEMBICARA, Role.SPONSOR])
  @ApiQuery({ name: 'nama', required: false, type: String })
  @ApiQuery({ name: 'waktu_mulai', required: false, type: String })
  @ApiQuery({ name: 'waktu_selesai', required: false, type: String })
  @ApiQuery({ name: 'includePembicara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeSponsor', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({
    description: 'Success get events',
    type: EventEntity,
    isArray: true,
  })
  async searchEvents(
    @Query() searchQuery: SearchEventDto,
    @Query('includePembicara') includePembicara: boolean = false,
    @Query('includeSponsor') includeSponsor: boolean = false,
  ) {
    this.logger.log('Search events', 'EventsController');
    const options = { includePembicara, includeSponsor };
    searchQuery.page = searchQuery.page || 1;
    searchQuery.size = searchQuery.size || 10;
    const result = await this.eventsService.searchEvents(searchQuery, options);

    return {
      message: 'Success get events',
      data: result.events,
      page: result.page,
    };
  }

  @Get(':eventId')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PEMBICARA, Role.SPONSOR])
  @ApiParam({ name: 'eventId', type: String })
  @ApiQuery({ name: 'includePembicara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeSponsor', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get event',
    type: EventEntity,
  })
  async getEvent(
    @Param('eventId') eventId: string,
    @Query('includePembicara') includePembicara: boolean = false,
    @Query('includeSponsor') includeSponsor: boolean = false,
  ) {
    this.logger.log('Get event', 'EventsController');
    const options = { includePembicara, includeSponsor };
    const result = await this.eventsService.getEvent(eventId, options);

    return {
      message: 'Success get event',
      data: result,
    };
  }

  @Post()
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiResponse({
    description: 'Success create event',
    type: EventEntity,
  })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    this.logger.log('Create event', 'EventsController');

    const result = await this.eventsService.createEvent(createEventDto);

    return {
      message: 'Success create event',
      data: result,
    };
  }

  @Patch(':eventId')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiParam({ name: 'eventId', type: String })
  @ApiQuery({ name: 'includePembicara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeSponsor', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success update event',
    type: EventEntity,
  })
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: CreateEventDto,
    @Query('includePembicara') includePembicara: boolean = false,
    @Query('includeSponsor') includeSponsor: boolean = false,
  ) {
    this.logger.log('Update event', 'EventsController');

    const options = { includePembicara, includeSponsor };

    const result = await this.eventsService.updateEvent(
      eventId,
      updateEventDto,
      options,
    );

    return {
      message: 'Success update event',
      data: result,
    };
  }

  @Delete(':eventId')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiParam({ name: 'eventId', type: String })
  @ApiQuery({ name: 'includePembicara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeSponsor', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success delete event',
    type: EventEntity,
  })
  async deleteEvent(
    @Param('eventId') eventId: string,
    @Query('includePembicara') includePembicara: boolean = false,
    @Query('includeSponsor') includeSponsor: boolean = false,
  ) {
    this.logger.log('Delete event', 'EventsController');

    const options = { includePembicara, includeSponsor };

    const result = await this.eventsService.deleteEvent(eventId, options);

    return {
      message: 'Success delete event',
      data: result,
    };
  }
}
