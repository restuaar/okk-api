import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SpeakersService } from './speakers.service';
import {
  CreateEventSpeakerDto,
  CreateSpeakerDto,
} from './dto/create-speaker.dto';
import {
  UpdateEventSpeakerDto,
  UpdateSpeakerDto,
} from './dto/update-speaker.dto';
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
import { EventSpeakerEntity, SpeakerEntity } from './entities/speaker.entity';
import { EventEntity } from 'src/events/entities/event.entity';

@ApiTags('Speakers')
@Controller('speakers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class SpeakersController {
  constructor(
    private readonly speakersService: SpeakersService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PEMBICARA, Role.PANITIA])
  @ApiQuery({ name: 'includeAcara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAkun', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get speakers',
    type: SpeakerEntity,
    isArray: true,
  })
  async getSpeakers(
    @Query('includeAcara') includeAcara: boolean = false,
    @Query('includeAkun') includeAkun: boolean = false,
  ) {
    this.logger.log('Get speakers', 'SpeakersController');

    const options = { includeAcara, includeAkun };
    const speakers = await this.speakersService.getSpeakers(options);

    return {
      message: 'Success get speakers',
      data: speakers,
    };
  }

  @Get(':username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PEMBICARA, Role.PANITIA])
  @ApiParam({ name: 'username', type: String })
  @ApiQuery({ name: 'includeAcara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAkun', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get speaker',
    type: SpeakerEntity,
  })
  async getSpeaker(
    @Param('username') username: string,
    @Query('includeAcara') includeAcara: boolean = false,
    @Query('includeAkun') includeAkun: boolean = false,
  ) {
    this.logger.log('Get speaker', 'SpeakersController');

    const options = { includeAcara, includeAkun };
    const speaker = await this.speakersService.getSpeaker(username, options);

    return {
      message: 'Success get speaker',
      data: speaker,
    };
  }

  @Post()
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.AKUN])
  @ApiResponse({
    description: 'Success create speaker',
    type: SpeakerEntity,
  })
  async createSpeaker(@Body() createSpeakerDto: CreateSpeakerDto) {
    this.logger.log('Create speaker', 'SpeakersController');

    const speaker = await this.speakersService.createSpeaker(createSpeakerDto);

    return {
      message: 'Success create speaker',
      data: speaker,
    };
  }

  @Patch(':username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PEMBICARA])
  @ApiParam({ name: 'username', type: String })
  @ApiQuery({ name: 'includeAcara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAkun', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success update speaker',
    type: SpeakerEntity,
  })
  async updateSpeaker(
    @Param('username') username: string,
    @Body() updateSpeakerDto: UpdateSpeakerDto,
    @Query('includeAcara') includeAcara: boolean = false,
    @Query('includeAkun') includeAkun: boolean = false,
  ) {
    this.logger.log('Update speaker', 'SpeakersController');

    const options = { includeAcara, includeAkun };
    const speaker = await this.speakersService.updateSpeaker(
      username,
      updateSpeakerDto,
      options,
    );

    return {
      message: 'Success update speaker',
      data: speaker,
    };
  }

  @Delete(':username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PEMBICARA])
  @ApiParam({ name: 'username', required: true, type: String })
  @ApiQuery({ name: 'includeAcara', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAkun', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success delete speaker',
    type: SpeakerEntity,
  })
  async deleteSpeaker(
    @Param('username') username: string,
    @Query('includeAcara') includeAcara: boolean = false,
    @Query('includeAkun') includeAkun: boolean = false,
  ) {
    this.logger.log('Delete speaker', 'SpeakersController');

    const options = { includeAcara, includeAkun };
    const speaker = await this.speakersService.deleteSpeaker(username, options);

    return {
      message: 'Success delete speaker',
      data: speaker,
    };
  }

  @Post('events')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PEMBICARA])
  @ApiResponse({
    description: 'Success add speaker to event',
    type: EventEntity,
  })
  async addSpeakerEvent(@Body() createEventSpeakerDto: CreateEventSpeakerDto) {
    this.logger.log('Add speaker to event', 'SpeakersController');

    const speaker = await this.speakersService.addSpeakerEvent(
      createEventSpeakerDto,
    );

    return {
      message: 'Success add speaker to event',
      data: speaker,
    };
  }

  @Patch('events')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PEMBICARA])
  @ApiResponse({
    description: 'Success update speaker event',
    type: EventSpeakerEntity,
  })
  async updateEventSpeaker(
    @Body() updateEventSpeakerDto: UpdateEventSpeakerDto,
  ) {
    this.logger.log('Update speaker event', 'SpeakersController');

    const speaker = await this.speakersService.updateEventSpeaker(
      updateEventSpeakerDto,
    );

    return {
      message: 'Success update speaker event',
      data: speaker,
    };
  }

  @Delete('events/:id_acara')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PEMBICARA])
  @ApiParam({ name: 'id_acara', required: true })
  @ApiResponse({
    description: 'Success delete speaker event',
    type: EventEntity,
  })
  async deleteEventSpeakers(@Param('id_acara') id_acara: string) {
    this.logger.log('Unassign event speaker', 'SpeakersController');

    const speaker = await this.speakersService.removeAllEventSpeakers(id_acara);

    return {
      message: 'Success unassign event speaker',
      data: speaker,
    };
  }

  @Delete('events/:id_acara/:id_pembicara')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PEMBICARA])
  @ApiParam({ name: 'id_acara', required: true })
  @ApiParam({ name: 'id_pembicara', required: true })
  @ApiResponse({
    description: 'Success delete speaker event',
    type: EventSpeakerEntity,
  })
  async deleteEventSpeaker(
    @Param('id_acara') id_acara: string,
    @Param('id_pembicara') id_pembicara: string,
  ) {
    this.logger.log('Unassign event speaker', 'SpeakersController');

    const speaker = await this.speakersService.deleteEventSpeaker(
      id_acara,
      id_pembicara,
    );

    return {
      message: 'Success unassign event speaker',
      data: speaker,
    };
  }
}
