import { Body, Controller, Delete, Get, Patch, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Req() request: Request) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.usersService.getMe(userId);
  }

  @Patch('me')
  updateMe(@Req() request: Request, @Body() dto: UpdateUserDto) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.usersService.updateMe(userId, dto);
  }

  @Delete('me')
  deleteMe(@Req() request: Request) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.usersService.deleteMe(userId);
  }
}
