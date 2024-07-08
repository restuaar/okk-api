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
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/interfaces/user.interface';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { SuccessResponse } from 'src/dto/success.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  async searchUser(
    @Query('nama') nama?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<SuccessResponse<UserEntity[]>> {
    const searchQuery: SearchUserDto = {
      nama,
      page: page ?? 1,
      size: size ?? 10,
    };
    const result = await this.usersService.searchUser(searchQuery);
    const users = result.users.map((user) => new UserEntity(user));
    const paging = result.page;
    return {
      message: 'Success get users',
      data: users,
      page: paging,
    };
  }

  @Get('/:id')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  async getUserById(@Param('id') id: string) {
    const user = new UserEntity(await this.usersService.getUser(id));
    return {
      message: 'Success get user',
      data: user,
    };
  }

  @Get('/username/:username')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  async getUserByUsername(@Param('username') username: string) {
    const user = new UserEntity(await this.usersService.getUser(username));
    return {
      message: 'Success get user',
      data: user,
    };
  }

  @Post()
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = new UserEntity(
      await this.usersService.createUser(createUserDto),
    );
    return {
      message: 'Success create user',
      data: user,
    };
  }

  @Post('/batch')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  async createManyUser(@Body() createUserDto: CreateUserDto[]) {
    const users = await this.usersService.createManyUser(createUserDto);
    const usersEntity = users.map((user) => new UserEntity(user));
    return {
      message: 'Success create user',
      data: usersEntity,
    };
  }

  @Patch('/:id')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = new UserEntity(
      await this.usersService.updateUser(id, updateUserDto),
    );
    return {
      message: 'Success update user',
      data: user,
    };
  }

  @Patch('/username/:username')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  async updateUserByUsername(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = new UserEntity(
      await this.usersService.updateUser(username, updateUserDto),
    );
    return {
      message: 'Success update user',
      data: user,
    };
  }

  @Delete('/:id')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  async deleteUserById(@Param('id') id: string) {
    const user = new UserEntity(await this.usersService.deleteUser(id));
    return {
      message: 'Success delete user',
      data: user,
    };
  }

  @Delete('/username/:username')
  @Roles([Role.PENGURUS_INTI, Role.PJ])
  async deleteUserByUsername(@Param('username') username: string) {
    const user = new UserEntity(await this.usersService.deleteUser(username));
    return {
      message: 'Success delete user',
      data: user,
    };
  }
}
