import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createPublicKey } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { verify } from 'jsonwebtoken';

type JwtPayload = {
  userId?: string;
  userName?: string;
  email?: string;
};

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  private readonly publicKey: string;

  constructor() {
    const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH ?? 'private.pem';
    const resolvedPath = isAbsolute(privateKeyPath)
      ? privateKeyPath
      : resolve(process.cwd(), privateKeyPath);

    try {
      const privateKey = readFileSync(resolvedPath, 'utf8');
      this.publicKey = createPublicKey(privateKey).export({ type: 'spki', format: 'pem' }).toString();
    } catch {
      throw new Error(`Unable to load private key from path: ${resolvedPath}`);
    }
  }

  use(request: Request, _response: Response, next: NextFunction): void {
    const token = this.extractBearerToken(request);

    try {
      const decoded = verify(token, this.publicKey, { algorithms: ['RS256'] }) as JwtPayload;

      if (!decoded.userId || !decoded.userName || !decoded.email) {
        throw new UnauthorizedException('Invalid access token payload');
      }

      request.user = {
        id: decoded.userId,
        name: decoded.userName,
        email: decoded.email,
      };

      next();
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractBearerToken(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    return token;
  }
}
