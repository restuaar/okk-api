import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MentoringsService } from './mentorings.service';
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
import { SearchMentoringDto } from './dto/search-meeting.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/interfaces/users.interface';
import { MeetingEntity } from 'src/meetings/entities/meeting.entity';
import { MentoringMenteeEntity } from './entities/mentoring.entity';
import { CreateMentoringDto } from './dto/create-mentoring.dto';

@ApiTags('Mentorings')
@Controller('mentorings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class MentoringsController {
  constructor(
    private readonly mentoringsService: MentoringsService,
    private readonly logger: LoggerService,
  ) {}

  @Get('/:noKelompok')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA, Role.MENTEE])
  @ApiParam({ name: 'noKelompok', required: true, type: Number })
  @ApiQuery({ name: 'date', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({
    description: 'Success get mentorings',
    type: MeetingEntity,
    isArray: true,
  })
  async getMentorings(
    @Param('noKelompok', ParseIntPipe) noKelompok: number,
    @Query('date') dateString: string,
    @Query() options: SearchMentoringDto,
  ) {
    this.logger.log('Get all mentorings', 'MentoringsController');

    const { page, size } = options;
    options.size = size || 10;
    options.page = page || 1;

    const result = await this.mentoringsService.getMentorings(
      noKelompok,
      dateString,
      options,
    );

    const mentorings = result.mentorings.map((mentoring) => {
      const mentoringAttendees = mentoring.mentee_hadir.map(
        (mentee) => new MentoringMenteeEntity(mentee),
      );
      mentoring.mentee_hadir = mentoringAttendees;
      return mentoring;
    });

    return {
      message: 'Success get mentorings',
      data: mentorings,
      page: result.page,
    };
  }

  @Get('/:noKelompok/:mentoringId')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA, Role.MENTEE])
  @ApiParam({ name: 'noKelompok', required: true, type: Number })
  @ApiParam({ name: 'mentoringId', required: true, type: String })
  @ApiResponse({
    description: 'Success get mentoring',
    type: MeetingEntity,
  })
  async getMentoring(
    @Param('noKelompok', ParseIntPipe) noKelompok: number,
    @Param('mentoringId') mentoringId: string,
  ) {
    this.logger.log('Get mentoring by id', 'MentoringsController');

    const mentoring = await this.mentoringsService.getMentoring(
      noKelompok,
      mentoringId,
    );
    const mentoringAttendees = mentoring.mentee_hadir.map(
      (mentee) => new MentoringMenteeEntity(mentee),
    );
    mentoring.mentee_hadir = mentoringAttendees;
    return {
      message: 'Success get mentoring',
      data: mentoring,
    };
  }

  @Post('/:noKelompok')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'noKelompok', required: true, type: Number })
  @ApiResponse({
    description: 'Success create mentoring',
    type: MeetingEntity,
  })
  async createMentoring(
    @Param('noKelompok', ParseIntPipe) noKelompok: number,
    @Body() createMentoringDto: CreateMentoringDto,
  ) {
    this.logger.log('Create mentoring', 'MentoringsController');

    const mentoring = await this.mentoringsService.createMentoring(
      noKelompok,
      createMentoringDto,
    );

    return {
      message: 'Success create mentoring',
      data: mentoring,
    };
  }

  @Patch('/:noKelompok/:mentoringId')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'noKelompok', required: true, type: Number })
  @ApiParam({ name: 'mentoringId', required: true, type: String })
  @ApiResponse({
    description: 'Success update mentoring',
    type: MeetingEntity,
  })
  async updateMentoring(
    @Param('noKelompok', ParseIntPipe) noKelompok: number,
    @Param('mentoringId') mentoringId: string,
    @Body() updateMentoringDto: CreateMentoringDto,
  ) {
    this.logger.log('Update mentoring', 'MentoringsController');

    const mentoring = await this.mentoringsService.updateMentoring(
      noKelompok,
      mentoringId,
      updateMentoringDto,
    );

    const mentoringAttendees = mentoring.mentee_hadir.map(
      (mentee) => new MentoringMenteeEntity(mentee),
    );
    mentoring.mentee_hadir = mentoringAttendees;

    return {
      message: 'Success update mentoring',
      data: mentoring,
    };
  }

  @Delete('/:noKelompok')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'noKelompok', required: true, type: Number })
  @ApiResponse({
    description: 'Success delete mentoring',
    type: MeetingEntity,
    isArray: true,
  })
  async deleteMentorings(@Param('noKelompok') noKelompok: number) {
    this.logger.log('Delete mentorings', 'MentoringsController');

    const mentorings =
      await this.mentoringsService.deleteMentorings(noKelompok);

    return {
      message: 'Success delete mentorings',
      data: mentorings,
    };
  }

  @Delete('/:noKelompok/:mentoringId')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'noKelompok', required: true, type: Number })
  @ApiParam({ name: 'mentoringId', required: true, type: String })
  @ApiResponse({
    description: 'Success delete mentoring',
    type: MeetingEntity,
  })
  async deleteMentoring(
    @Param('noKelompok', ParseIntPipe) noKelompok: number,
    @Param('mentoringId') mentoringId: string,
  ) {
    this.logger.log('Delete mentoring', 'MentoringsController');

    const mentoring = await this.mentoringsService.deleteMentoring(
      noKelompok,
      mentoringId,
    );

    return {
      message: 'Success delete mentoring',
      data: mentoring,
    };
  }

  @Post('/:noKelompok/:mentoringId/attendance')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'noKelompok', required: true, type: Number })
  @ApiParam({ name: 'mentoringId', required: true, type: String })
  @ApiResponse({
    description: 'Success add attendance',
    type: String,
  })
  async addAttendance(
    @Param('noKelompok', ParseIntPipe) noKelompok: number,
    @Param('mentoringId') mentoringId: string,
    @Body('username') username: string,
  ) {
    this.logger.log('Add attendance', 'MentoringsController');

    const result = await this.mentoringsService.addAttendee(
      noKelompok,
      mentoringId,
      username,
    );

    return {
      message: 'Success add attendance',
      data: result,
    };
  }

  @Delete('/:noKelompok/:mentoringId/attendance')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiParam({ name: 'noKelompok', required: true, type: Number })
  @ApiParam({ name: 'mentoringId', required: true, type: String })
  @ApiParam({ name: 'username', required: true })
  @ApiResponse({
    description: 'Success delete attendance',
    type: String,
  })
  async deleteAttendance(
    @Param('noKelompok', ParseIntPipe) noKelompok: number,
    @Param('mentoringId') mentoringId: string,
    @Body('username') username: string,
  ) {
    this.logger.log('Delete attendance', 'MentoringsController');

    const result = await this.mentoringsService.removeAttendee(
      noKelompok,
      mentoringId,
      username,
    );

    return {
      message: 'Success delete attendance',
      data: result,
    };
  }
}
