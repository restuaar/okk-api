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
import { MeetingsService } from './meetings.service';
import {
  MeetingEntity,
  MeetingOrganizerEntity,
} from './entities/meeting.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/interfaces/users.interface';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { SearchMeetingDto } from './dto/search-meeting.dto';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';

@ApiTags('Meetings')
@Controller('meetings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get('/:divisionId')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'divisionId', required: true })
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  @ApiResponse({
    description: 'Success get meetings',
    type: MeetingEntity,
    isArray: true,
  })
  async getMeetings(
    @Param('divisionId') divisionId: string,
    @Query('date') dateString: string,
    @Query() options: SearchMeetingDto,
  ) {
    const { page, size } = options;
    options.size = size || 10;
    options.page = page || 1;

    const result = await this.meetingsService.getMeetings(
      divisionId,
      dateString,
      options,
    );
    const meetingsOrganizers = result.data.map((meet) => {
      const meetingOrganizer = meet.panitia_hadir.map(
        (panitia) => new MeetingOrganizerEntity(panitia),
      );
      meet.panitia_hadir = meetingOrganizer;
      return meet;
    });

    return {
      message: 'Success get meetings',
      data: meetingsOrganizers,
      page: result.page,
    };
  }

  @Get('/:divisionId/:meetingId')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'divisionId', required: true })
  @ApiParam({ name: 'meetingId', required: true })
  @ApiResponse({
    description: 'Success get meeting',
    type: MeetingEntity,
  })
  async getMeeting(
    @Param('divisionId') divisionId: string,
    @Param('meetingId') meetingId: string,
  ) {
    const meeting = await this.meetingsService.getMeeting(
      divisionId,
      meetingId,
    );
    const meetingOrganizers = meeting.panitia_hadir.map(
      (panitia) => new MeetingOrganizerEntity(panitia),
    );
    meeting.panitia_hadir = meetingOrganizers;
    return {
      message: 'Success get meeting',
      data: meeting,
    };
  }

  @Post('/:divisionId')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiResponse({
    description: 'Success create meeting',
    type: MeetingEntity,
  })
  async createMeeting(
    @Param('divisionId') divisionId: string,
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    const meeting = await this.meetingsService.createMeeting(
      divisionId,
      createMeetingDto,
    );
    return {
      message: 'Success create meeting',
      data: meeting,
    };
  }

  @Patch('/:divisionId/:meetingId')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiParam({ name: 'divisionId', required: true })
  @ApiParam({ name: 'meetingId', required: true })
  @ApiResponse({
    description: 'Success update meeting',
    type: MeetingEntity,
  })
  async updateMeeting(
    @Param('divisionId') divisionId: string,
    @Param('meetingId') meetingId: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ) {
    const meeting = await this.meetingsService.updateMeeting(
      divisionId,
      meetingId,
      updateMeetingDto,
    );
    const meetingOrganizer = meeting.panitia_hadir.map(
      (panitia) => new MeetingOrganizerEntity(panitia),
    );
    meeting.panitia_hadir = meetingOrganizer;
    return {
      message: 'Success update meeting',
      data: meeting,
    };
  }

  @Delete('/:divisionId')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiParam({ name: 'divisionId', required: true })
  @ApiResponse({
    description: 'Success delete meeting',
    type: MeetingEntity,
    isArray: true,
  })
  async deleteMeeting(@Param('divisionId') divisionId: string) {
    const meeting = await this.meetingsService.deleteMeetings(divisionId);
    return {
      message: 'Success delete meeting',
      data: meeting,
    };
  }

  @Delete('/:divisionId/:meetingId')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  @ApiParam({ name: 'divisionId', required: true })
  @ApiParam({ name: 'meetingId', required: true })
  @ApiResponse({
    description: 'Success delete meeting',
    type: MeetingEntity,
  })
  async deleteMeetingById(
    @Param('divisionId') divisionId: string,
    @Param('meetingId') meetingId: string,
  ) {
    const meeting = await this.meetingsService.deleteMeeting(
      divisionId,
      meetingId,
    );
    return {
      message: 'Success delete meeting',
      data: meeting,
    };
  }

  @Post('/:divisionId/:meetingId/attendance')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'divisionId', required: true })
  @ApiParam({ name: 'meetingId', required: true })
  @ApiResponse({
    description: 'Success add attendance',
    type: String,
  })
  async addAttendance(
    @Param('divisionId') divisionId: string,
    @Param('meetingId') meetingId: string,
    @Body('username') username: string,
  ) {
    const meeting = await this.meetingsService.addAttendance(
      divisionId,
      meetingId,
      username,
    );
    return {
      message: 'Success add attendance',
      data: meeting,
    };
  }

  @Delete('/:divisionId/:meetingId/attendance')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'divisionId', required: true })
  @ApiParam({ name: 'meetingId', required: true })
  @ApiParam({ name: 'username', required: true })
  @ApiResponse({
    description: 'Success delete attendance',
    type: String,
  })
  async deleteAttendance(
    @Param('divisionId') divisionId: string,
    @Param('meetingId') meetingId: string,
    @Body('username') username: string,
  ) {
    const meeting = await this.meetingsService.deleteAttendance(
      divisionId,
      meetingId,
      username,
    );
    return {
      message: 'Success delete attendance',
      data: meeting,
    };
  }
}
