import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Req() request: Request) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.tasksService.getAll(userId);
  }

  @Post()
  createTask(@Req() request: Request, @Body() dto: CreateTaskDto) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.tasksService.create(userId, dto);
  }

  @Patch(':id')
  updateTask(@Req() request: Request, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.tasksService.update(userId, id, dto);
  }

  @Delete(':id')
  deleteTask(@Req() request: Request, @Param('id') id: string) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.tasksService.delete(userId, id);
  }
}
