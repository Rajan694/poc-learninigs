import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createPublicKey, createVerify, KeyObject } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
};

type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

type JwtHeader = {
  alg?: string;
};

type JwtPayload = {
  userId?: string;
  userName?: string;
  email?: string;
  exp?: number;
};

@Injectable()
export class Rs256AuthMiddleware implements NestMiddleware {
  private readonly publicKey: KeyObject;

  constructor() {
    const keyPath = process.env.JWT_PUBLIC_KEY_PATH ?? 'public.pem';
    const resolvedPath = isAbsolute(keyPath) ? keyPath : resolve(process.cwd(), keyPath);

    try {
      const publicKeyPem = readFileSync(resolvedPath, 'utf8');
      this.publicKey = createPublicKey(publicKeyPem);
    } catch {
      throw new Error(`Failed to load JWT public key from path: ${resolvedPath}`);
    }
  }

  use(request: Request, _response: Response, next: NextFunction): void {
    const token = this.extractBearerToken(request);
    const decoded = this.decodeAndVerifyToken(token);

    if (!decoded.userId || !decoded.userName || !decoded.email) {
      throw new UnauthorizedException('Invalid access token payload');
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = {
      id: decoded.userId,
      name: decoded.userName,
      email: decoded.email,
    };

    next();
  }

  private extractBearerToken(request: Request): string {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authorizationHeader.slice('Bearer '.length).trim();

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    return token;
  }

  private decodeAndVerifyToken(token: string): JwtPayload {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new UnauthorizedException('Malformed access token');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    const header = this.parseJsonSegment<JwtHeader>(encodedHeader);
    if (header.alg !== 'RS256') {
      throw new UnauthorizedException('Unsupported token algorithm');
    }

    const signedContent = `${encodedHeader}.${encodedPayload}`;
    const signature = this.base64UrlToBuffer(encodedSignature);

    const verifier = createVerify('RSA-SHA256');
    verifier.update(signedContent);
    verifier.end();

    const isValid = verifier.verify(this.publicKey, signature);
    if (!isValid) {
      throw new UnauthorizedException('Invalid token signature');
    }

    const payload = this.parseJsonSegment<JwtPayload>(encodedPayload);

    if (typeof payload.exp === 'number' && Date.now() >= payload.exp * 1000) {
      throw new UnauthorizedException('Access token expired');
    }

    return payload;
  }

  private parseJsonSegment<T>(value: string): T {
    try {
      const json = Buffer.from(value, 'base64url').toString('utf8');
      return JSON.parse(json) as T;
    } catch {
      throw new UnauthorizedException('Malformed access token');
    }
  }

  private base64UrlToBuffer(value: string): Buffer {
    try {
      return Buffer.from(value, 'base64url');
    } catch {
      throw new UnauthorizedException('Malformed access token');
    }
  }
}
