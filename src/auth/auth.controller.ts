import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthResponse } from './dto/auth.dto';
import { Request, Response } from 'express';
import { jwtConvertTime } from 'src/utils/jwt-convert-time';
import { SuccessResponse } from 'src/dto/success.dto';
import { LoginRequestDto } from './dto/login.dto';
import { createResponseSchema } from 'src/utils/schema-swagger';
import { LoggerService } from 'src/common/logger/logger.service';
import { RegisterRequestDto } from './dto/register.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  @Post('/register')
  @ApiOkResponse({
    schema: createResponseSchema(UserEntity),
  })
  async register(
    @Body() createUserDto: RegisterRequestDto,
  ): Promise<SuccessResponse<UserEntity>> {
    const user = new UserEntity(await this.authService.register(createUserDto));
    this.logger.log(
      `Register success with user ${user.username}`,
      'AuthController',
    );
    return {
      message: 'Register success',
      data: user,
    };
  }

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
      req.user as UserEntity,
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

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    schema: createResponseSchema(UserEntity),
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse<UserEntity>> {
    const user = req.user as UserEntity;
    const logoutUser = new UserEntity(await this.authService.logout(user));
    this.logger.log(
      `Logout success with username: ${logoutUser.username}`,
      'AuthController',
    );
    this.clearRefreshTokenCookie(res);
    return {
      message: 'Logout success',
      data: logoutUser,
    };
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: createResponseSchema(UserEntity),
  })
  async getProfile(@Req() req: Request): Promise<SuccessResponse<UserEntity>> {
    const user = new UserEntity(req.user);
    this.logger.log(
      `Get profile success with user ${user.username}`,
      'AuthController',
    );
    return {
      message: 'Get profile success',
      data: user,
    };
  }

  @Patch('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: createResponseSchema(UserEntity),
  })
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponse<UserEntity>> {
    const user = new UserEntity(
      await this.authService.updateProfile(
        req.user as UserEntity,
        updateUserDto,
      ),
    );
    this.logger.log(
      `Update profile success with user ${user.username}`,
      'AuthController',
    );
    return {
      message: 'Update profile success',
      data: user,
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
    const refreshToken = req.signedCookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    this.logger.log(
      `Refresh token success with refresh token ${refreshToken}`,
      'AuthController',
    );

    const { access_token, refresh_token } =
      await this.authService.handleRefreshToken(refreshToken);

    this.setRefreshTokenCookie(res, refresh_token);

    return {
      message: 'Refresh token success',
      data: { access_token },
    };
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    const timeJwt = this.configService.get<string>('jwt.expiresInRefresh');

    res.cookie('refreshToken', token, {
      signed: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: jwtConvertTime(timeJwt),
      path: '/api/v1/auth/refresh-token',
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/api/v1/auth/refresh-token',
    });
  }
}
