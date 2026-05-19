import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) response: Response) {
    const { user, token, refreshToken } = await this.authService.signup(dto);
    this.setRefreshCookie(response, refreshToken);
    return { user, token };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { user, token, refreshToken } = await this.authService.login(dto);
    this.setRefreshCookie(response, refreshToken);
    return { user, token };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: { refreshToken?: string },
  ) {
    const refreshToken = request.cookies?.refreshToken ?? body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const refreshed = await this.authService.refreshAccessToken(refreshToken);
    this.setRefreshCookie(response, refreshed.refreshToken);

    return { token: refreshed.token };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: { refreshToken?: string },
  ) {
    const refreshToken = request.cookies?.refreshToken ?? body?.refreshToken;

    await this.authService.logout(refreshToken);
    this.clearRefreshCookie(response);

    return { success: true };
  }

  private setRefreshCookie(response: Response, refreshToken: string): void {
    const maxAgeMs = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30) * 24 * 60 * 60 * 1000;

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth',
      maxAge: maxAgeMs,
    });
  }

  private clearRefreshCookie(response: Response): void {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth',
    });
  }
}
