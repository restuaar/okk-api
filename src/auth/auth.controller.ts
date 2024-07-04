import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponse } from './dto/auth.dto';
import { Request, Response } from 'express';
import { jwtConvertTime } from 'src/utils/jwt-convert-time';
import { SuccessResponse } from 'src/dto/success.dto';
import { LoginRequestDto } from './dto/login.dto';
import { createResponseSchema } from 'src/utils/schema-swagger';
import { User } from './dto/user.dto';
import { LoggerService } from 'src/common/logger/logger.service';

@ApiTags('Auth')
@Controller({
  version: '1',
  path: 'auth',
})
@ApiExtraModels(User)
@ApiExtraModels(AuthResponse)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({
    schema: createResponseSchema(AuthResponse),
  })
  async login(
    @Body() _: LoginRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse<AuthResponse>> {
    const { access_token, refresh_token } = await this.authService.login(
      req.user as User,
    );
    this.logger.log(
      `Login success with jwt: ${access_token}`,
      'AuthController',
    );

    this.setRefreshTokenCookie(res, refresh_token);
    return {
      message: 'Login success',
      data: { access_token },
    };
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: createResponseSchema(User),
  })
  async getProfile(@Req() req: Request): Promise<SuccessResponse<User>> {
    const user = req.user as User;
    this.logger.log(
      `Get profile success with user ${user.username}`,
      'AuthController',
    );
    return {
      message: 'Get profile success',
      data: {
        nama: user.nama,
        username: user.username,
        createdAt: user.createdAt,
      },
    };
  }

  @Get('/refresh-token')
  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({
    schema: createResponseSchema(AuthResponse),
  })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse<AuthResponse>> {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    this.logger.log(
      `Refresh token success with refresh token ${refreshToken}`,
      'AuthController',
    );

    const { access_token, refresh_token } =
      await this.authService.handleRefreshToken(req.cookies.refreshToken);

    this.setRefreshTokenCookie(res, refresh_token);

    return {
      message: 'Refresh token success',
      data: { access_token },
    };
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    const timeJwt = this.configService.get<string>('jwt.expiresInRefresh');

    res.cookie('refreshToken', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: jwtConvertTime(timeJwt),
      path: '/api/v1/auth/refresh-token',
    });
  }
}
