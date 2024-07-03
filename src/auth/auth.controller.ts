import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponse } from './dto/auth.dto';
import { ResponseDto } from 'src/dto/response.dto';
import { Response } from 'express';
import { jwtConvertTime } from 'src/utils/jwt-convert-time';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto<AuthResponse>> {
    const { access_token, refresh_token } = this.authService.login(req.user);

    const payload = {
      access_token,
      refresh_token: this.setRefreshTokenCookie(res, refresh_token),
    };

    return {
      message: 'Login success',
      data: payload,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('/refresh-token')
  async refreshToken(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto<AuthResponse>> {
    if (!req.cookies.refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { access_token, refresh_token } = this.authService.handleRefreshToken(
      req.cookies.refreshToken,
    );

    const payload = {
      access_token,
      refresh_token: this.setRefreshTokenCookie(res, refresh_token),
    };

    return {
      message: 'Refresh token success',
      data: payload,
    };
  }

  private setRefreshTokenCookie(res: Response, token: string): string {
    const timeJwt = this.configService.get<string>('jwt.expiresInRefresh');

    res.cookie('refreshToken', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: jwtConvertTime(timeJwt),
      path: '/refresh-token',
    });

    return token;
  }
}
