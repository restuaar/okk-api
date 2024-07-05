import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './dto/auth.dto';
import { PrismaService } from 'src/common/database/database.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/common/logger/logger.service';
import { PayloadAuth } from 'src/interfaces/auth.interface';
import { RegisterRequestDto } from './dto/register.dto';
import { ROUND_OF_SALT } from 'src/utils/constant';
import { UserEntity } from './entities/user.entity';

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

    const user = await this.prismaService.akun.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      const { password } = user;
      const isMatch = await compare(passwordReq, password);
      if (isMatch) return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUserById(id: string): Promise<UserEntity> {
    this.logger.log(`Validating user with id ${id}`, 'AuthService');

    const user = await this.prismaService.akun.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async register(user: RegisterRequestDto): Promise<UserEntity> {
    this.logger.log(`Register with user ${user.username}`, 'AuthService');

    const userCreated = await this.prismaService.akun.create({
      data: {
        ...user,
        password: await hash(user.password, ROUND_OF_SALT),
      },
    });

    return userCreated;
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
