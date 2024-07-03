import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './dto/auth.dto';
import { PrismaService } from '../common/database/database.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, passwordReq: string) {
    const user = await this.prismaService.akun.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      const { password, ...result } = user;
      const isMatch = await compare(passwordReq, password);
      if (isMatch) return result;
    }

    return null;
  }

  login(user): AuthResponse {
    const payload = { id: user.id };
    return this.generateToken(payload);
  }

  handleRefreshToken(token: string): AuthResponse {
    try {
      const payload = this.jwtService.verify(token);
      return this.generateToken({ id: payload.id });
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  generateToken(payload: any): AuthResponse {
    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '20s',
    });
    return {
      access_token,
      refresh_token,
    };
  }
}
