import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './dto/auth.dto';
import { PrismaService } from 'src/common/database/database.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/common/logger/logger.service';
import { PayloadAuth } from 'src/interfaces/user.interface';
import { RegisterRequestDto } from './dto/register.dto';
import { ROUND_OF_SALT } from 'src/interfaces/constant';
import { UserEntity } from 'src/users/entities/user.entity';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { v6 as uuidv6 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async validateUser(
    username: string,
    passwordReq: string,
  ): Promise<UserEntity> {
    this.logger.log(`Validating user ${username}`, 'AuthService');

    const roleUser = await this.prismaService.getRoleUser(username);
    const user = await this.prismaService.akun.findUnique({
      where: {
        username,
      },
      include: roleUser.type,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await compare(passwordReq, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      ...user,
      role: roleUser.role,
    };
  }

  async validateUserById(id: string): Promise<UserEntity> {
    this.logger.log(`Validating user with id ${id}`, 'AuthService');

    const roleUser = await this.prismaService.getRoleUser(id, true);
    const user = await this.prismaService.akun.findUnique({
      where: {
        id,
      },
      include: roleUser.type,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      ...user,
      role: roleUser.role,
    };
  }

  async register(user: RegisterRequestDto): Promise<UserEntity> {
    this.logger.log(`Register with user ${user.username}`, 'AuthService');

    const userCreated = await this.prismaService.akun.create({
      data: {
        ...user,
        id: uuidv6(),
        password: await hash(user.password, ROUND_OF_SALT),
      },
    });

    const roleUser = await this.prismaService.getRoleUser(user.username);
    return { ...userCreated, role: roleUser.role };
  }

  async login(user: UserEntity): Promise<AuthResponse> {
    this.logger.log(`Login with user ${user.username}`, 'AuthService');

    const payload: PayloadAuth = { sub: user.id };
    await this.prismaService.refreshToken.deleteMany({
      where: {
        idUser: user.id,
      },
    });
    return this.generateToken(payload);
  }

  async logout(user: UserEntity): Promise<UserEntity> {
    this.logger.log(`Logout with user ${user.username}`, 'AuthService');

    await this.prismaService.refreshToken.deleteMany({
      where: {
        idUser: user.id,
      },
    });
    return user;
  }

  async updateProfile(
    user: UserEntity,
    updateUser: UpdateUserDto,
  ): Promise<UserEntity> {
    this.logger.log(`Update user with id ${user.id}`, 'AuthService');

    const roleUser = await this.prismaService.getRoleUser(user.username);
    const userUpdated = await this.prismaService.akun.update({
      where: {
        id: user.id,
        username: user.username,
      },
      data: {
        username: updateUser.username ?? user.username,
        password: updateUser.password
          ? await hash(updateUser.password, ROUND_OF_SALT)
          : user.password,
        nama: updateUser.nama ?? user.nama,
      },
      include: roleUser.type,
    });

    return { ...userUpdated, role: roleUser.role };
  }

  async handleRefreshToken(refreshToken: string): Promise<AuthResponse> {
    this.logger.log(
      `Handle refresh token with refresh token ${refreshToken} `,
      'AuthService',
    );

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.secretRefresh'),
      });
      const token = await this.prismaService.refreshToken.delete({
        where: {
          idUser: payload.sub,
          token: refreshToken,
        },
      });
      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }
      return await this.generateToken({ sub: payload.sub });
    } catch (e) {
      this.logger.error(e.message, e.stack, 'AuthService');
      throw new UnauthorizedException('Invalid token');
    }
  }

  async generateToken(payload: PayloadAuth): Promise<AuthResponse> {
    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.expiresInRefresh'),
      secret: this.configService.get<string>('jwt.secretRefresh'),
    });
    await this.prismaService.refreshToken.create({
      data: {
        idUser: payload.sub,
        token: refresh_token,
      },
    });
    return {
      access_token,
      refresh_token,
    };
  }
}
