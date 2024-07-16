import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ROUND_OF_SALT } from 'src/interfaces/constant';
import { hash } from 'bcrypt';
import { v6 as uuidv6 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate as isUUID } from 'uuid';
import { UserEntity } from './entities/user.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { Page } from 'src/dto/success.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async searchUser(
    searchQuery: SearchUserDto,
  ): Promise<{ users: UserEntity[]; page: Page }> {
    this.logger.log('Search user', 'UsersService');

    const { nama, page, size } = searchQuery;

    const [result, totalData] = await Promise.all([
      this.prismaService.akun.findMany({
        where: {
          nama: {
            contains: nama,
          },
        },
        skip: (page - 1) * size,
        take: size,
      }),
      this.prismaService.akun.count({
        where: {
          nama: {
            contains: nama,
          },
        },
      }),
    ]);

    const usersWithRole = await Promise.all(
      result.map((user) => this.getUser(user.id)),
    );

    const users = usersWithRole.map((user) => ({
      ...user,
      role: user.role,
    }));

    return {
      users,
      page: {
        current_page: page,
        total_page: Math.ceil(totalData / size),
        size,
        total_size: totalData,
      },
    };
  }

  async getUser(unique: string): Promise<UserEntity> {
    this.logger.log(`Get user ${unique}`, 'UsersService');

    const isId = isUUID(unique);
    const roleUser = await this.prismaService.getRoleUser(unique, isId);
    const user = await this.prismaService.akun.findUnique({
      where: isId ? { id: unique } : { username: unique },
      include: roleUser.type,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      role: roleUser.role,
      type: roleUser.type,
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    this.logger.log(
      `Create user with username ${createUserDto.username}`,
      'UsersService',
    );

    const user = await this.prismaService.akun.create({
      data: {
        ...createUserDto,
        id: uuidv6(),
        password: await hash(createUserDto.password, ROUND_OF_SALT),
      },
    });

    const roleUser = await this.prismaService.getRoleUser(user.username);

    return {
      ...user,
      role: roleUser.role,
    };
  }

  async createManyUser(createUserDtos: CreateUserDto[]): Promise<UserEntity[]> {
    const usersPromise = createUserDtos.map(async (user) => {
      this.logger.log(
        `Create user with username ${user.username}`,
        'UsersService',
      );
      return {
        ...user,
        id: user.id ?? uuidv6(),
        password: await hash(user.password, ROUND_OF_SALT),
      };
    });

    const users = await Promise.all(usersPromise);
    const createdUsers = await this.prismaService.akun.createManyAndReturn({
      data: users,
    });

    const roleUsers = await Promise.all(
      createdUsers.map((user) => this.prismaService.getRoleUser(user.username)),
    );

    return createdUsers.map((user, index) => ({
      ...user,
      role: roleUsers[index].role,
    }));
  }

  async updateUser(
    unique: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    this.logger.log(`Update user ${unique}`, 'UsersService');

    const user = await this.getUser(unique);
    const userUpdated = await this.prismaService.akun.update({
      where: { id: user.id },
      data: {
        username: updateUserDto.username ?? user.username,
        nama: updateUserDto.nama ?? user.nama,
        password: updateUserDto.password
          ? await hash(updateUserDto.password, ROUND_OF_SALT)
          : user.password,
      },
      include: user.type,
    });

    return {
      ...userUpdated,
      role: user.role,
    };
  }

  async deleteUser(unique: string): Promise<UserEntity> {
    this.logger.log(`Delete user ${unique}`, 'UsersService');

    const user = await this.getUser(unique);
    await this.prismaService.akun.delete({
      where: { id: user.id },
      include: user.type,
    });

    return {
      ...user,
      role: user.role,
    };
  }
}
