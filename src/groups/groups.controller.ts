import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/interfaces/users.interface';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupEntity } from './entities/group.entity';

@ApiTags('Groups')
@Controller('groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA, Role.MENTEE])
  @ApiQuery({ name: 'includeMentor', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAnggota', required: false, type: Boolean })
  @ApiQuery({ name: 'includeMentoring', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get all groups',
    type: GroupEntity,
    isArray: true,
  })
  async getAllGroups(
    @Query('includeMentor', new ParseBoolPipe({ optional: true }))
    includeMentor: boolean = false,
    @Query('includeAnggota', new ParseBoolPipe({ optional: true }))
    includeAnggota: boolean = false,
    @Query('includeMentoring', new ParseBoolPipe({ optional: true }))
    includeMentoring: boolean = false,
  ) {
    this.logger.log('Fetching all groups', 'GroupsController');

    const options = {
      includeMentor,
      includeAnggota,
      includeMentoring,
    };
    const groups = this.groupsService.getAllGroups(options);
    return {
      message: 'Success get all groups',
      data: groups,
    };
  }

  @Get(':no')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA, Role.MENTEE])
  @ApiQuery({ name: 'includeMentor', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAnggota', required: false, type: Boolean })
  @ApiQuery({ name: 'includeMentoring', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get group by no',
    type: GroupEntity,
  })
  async getGroupByNo(
    @Param('no', ParseIntPipe) no: number,
    @Query('includeMentor', new ParseBoolPipe({ optional: true }))
    includeMentor: boolean = false,
    @Query('includeAnggota', new ParseBoolPipe({ optional: true }))
    includeAnggota: boolean = false,
    @Query('includeMentoring', new ParseBoolPipe({ optional: true }))
    includeMentoring: boolean = false,
  ) {
    this.logger.log('Fetching group by no', 'GroupsController');
    const options = {
      includeMentor,
      includeAnggota,
      includeMentoring,
    };

    const group = this.groupsService.getGroupByNo(no, options);
    return {
      message: 'Success get group by no',
      data: group,
    };
  }

  @Get('mentor/:username')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA, Role.MENTEE])
  @ApiQuery({ name: 'includeMentor', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAnggota', required: false, type: Boolean })
  @ApiQuery({ name: 'includeMentoring', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get group by no',
    type: GroupEntity,
    isArray: true,
  })
  async getGroupByMentor(
    @Param('username') username: string,
    @Query('includeMentor', new ParseBoolPipe({ optional: true }))
    includeMentor: boolean = false,
    @Query('includeAnggota', new ParseBoolPipe({ optional: true }))
    includeAnggota: boolean = false,
    @Query('includeMentoring', new ParseBoolPipe({ optional: true }))
    includeMentoring: boolean = false,
  ) {
    this.logger.log('Fetching group by mentor', 'GroupsController');
    const options = {
      includeMentor,
      includeAnggota,
      includeMentoring,
    };

    const groups = this.groupsService.getGroupByMentor(username, options);
    return {
      message: 'Success get group by mentor',
      data: groups,
    };
  }

  @Post()
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiResponse({
    description: 'Success get group by no',
    type: GroupEntity,
  })
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    this.logger.log('Create group', 'GroupsController');
    const group = this.groupsService.createGroup(createGroupDto);
    return {
      message: 'Success create group',
      data: group,
    };
  }

  @Patch(':no')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiQuery({ name: 'includeMentor', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAnggota', required: false, type: Boolean })
  @ApiQuery({ name: 'includeMentoring', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get group by no',
    type: GroupEntity,
  })
  async updateGroup(
    @Param('no', ParseIntPipe) no: number,
    @Body() updateGroupDto: UpdateGroupDto,
    @Query('includeMentor', new ParseBoolPipe({ optional: true }))
    includeMentor: boolean = false,
    @Query('includeAnggota', new ParseBoolPipe({ optional: true }))
    includeAnggota: boolean = false,
    @Query('includeMentoring', new ParseBoolPipe({ optional: true }))
    includeMentoring: boolean = false,
  ) {
    this.logger.log('Delete group', 'GroupsController');

    const options = {
      includeMentor,
      includeAnggota,
      includeMentoring,
    };
    const group = this.groupsService.updateGroup(no, updateGroupDto, options);
    return {
      message: 'Success delete group',
      data: group,
    };
  }

  @Delete(':no')
  @Roles([Role.PENGURUS_INTI, Role.PJ, Role.PANITIA])
  @ApiQuery({ name: 'includeMentor', required: false, type: Boolean })
  @ApiQuery({ name: 'includeAnggota', required: false, type: Boolean })
  @ApiQuery({ name: 'includeMentoring', required: false, type: Boolean })
  @ApiResponse({
    description: 'Success get group by no',
    type: GroupEntity,
  })
  async deleteGroup(
    @Param('no', ParseIntPipe) no: number,
    @Query('includeMentor', new ParseBoolPipe({ optional: true }))
    includeMentor: boolean = false,
    @Query('includeAnggota', new ParseBoolPipe({ optional: true }))
    includeAnggota: boolean = false,
    @Query('includeMentoring', new ParseBoolPipe({ optional: true }))
    includeMentoring: boolean = false,
  ) {
    this.logger.log('Delete group', 'GroupsController');

    const options = {
      includeMentor,
      includeAnggota,
      includeMentoring,
    };
    const group = this.groupsService.deleteGroup(no, options);
    return {
      message: 'Success delete group',
      data: group,
    };
  }
}
