import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { sign } from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { isAbsolute, resolve } from 'node:path';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type SafeUser = {
  id: string;
  name: string;
  email: string;
};

@Injectable()
export class AuthService {
  private readonly privateKey: string;

  constructor(private readonly prisma: PrismaService) {
    const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH ?? 'private.pem';
    const resolvedPath = isAbsolute(privateKeyPath)
      ? privateKeyPath
      : resolve(process.cwd(), privateKeyPath);

    try {
      this.privateKey = readFileSync(resolvedPath, 'utf8');
    } catch {
      throw new Error(`Unable to load private key from path: ${resolvedPath}`);
    }
  }

  async signup(
    dto: SignupDto,
  ): Promise<{ user: SafeUser; token: string; refreshToken: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = this.signAccessToken(user);
    const refreshToken = await this.createRefreshToken(user.id);

    return { user: this.toSafeUser(user), token, refreshToken };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ user: SafeUser; token: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signAccessToken(user);
    const refreshToken = await this.createRefreshToken(user.id);

    return { user: this.toSafeUser(user), token, refreshToken };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ token: string; refreshToken: string }> {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (
      !tokenRecord ||
      tokenRecord.revokedAt ||
      tokenRecord.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: tokenRecord.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    const rotatedRefreshToken = await this.createRefreshToken(user.id);
    const token = this.signAccessToken(user);

    return { token, refreshToken: rotatedRefreshToken };
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private signAccessToken(user: User): string {
    const expiresIn = (process.env.ACCESS_TOKEN_TTL ??
      '15m') as SignOptions['expiresIn'];

    return sign(
      {
        userId: user.id,
        userName: user.name,
        email: user.email,
      },
      this.privateKey,
      {
        algorithm: 'RS256',
        expiresIn,
      },
    );
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const refreshToken = randomUUID();
    const ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30);
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return refreshToken;
  }

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
