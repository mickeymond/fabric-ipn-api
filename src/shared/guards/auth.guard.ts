import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { verifyToken } from '../../utils/jwtHelpers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (request && request.headers.authorization) {
      try {
        const token = request.headers.authorization.split(' ')[1];
        request['user'] = verifyToken(token, this.configService.get<string>('JWT_SECRET'));
        return true;
      } catch (error) {
        throw new UnauthorizedException(error.message);
      }
    }
    return false;
  }
}