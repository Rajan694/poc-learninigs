import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { CacheService } from '../common/cache.service';
import { PrismaService } from '../common/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private readonly cacheTtlSeconds = 60;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async getAll(userId: string) {
    const cacheKey = this.buildUserCacheKey(userId);
    const cachedTasks = await this.cache.getJson<ReturnType<TasksService['toTaskResponse']>[]>(cacheKey);

    if (cachedTasks) {
      return cachedTasks;
    }

    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const response = tasks.map((task) => this.toTaskResponse(task));
    await this.cache.setJson(cacheKey, response, this.cacheTtlSeconds);

    return response;
  }

  async create(userId: string, dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description ?? '',
        status: this.toPrismaStatus(dto.status),
        priority: this.toPrismaPriority(dto.priority),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : new Date(),
      },
    });

    await this.invalidateUserCache(userId);
    return this.toTaskResponse(task);
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const existingTask = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    const data: Prisma.TaskUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.status !== undefined) data.status = this.toPrismaStatus(dto.status);
    if (dto.priority !== undefined) data.priority = this.toPrismaPriority(dto.priority);
    if (dto.dueDate !== undefined) data.dueDate = new Date(dto.dueDate);

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data,
    });

    await this.invalidateUserCache(userId);
    return this.toTaskResponse(updatedTask);
  }

  async delete(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.delete({ where: { id: taskId } });
    await this.invalidateUserCache(userId);

    return { success: true };
  }

  private toTaskResponse(task: {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date;
    createdAt: Date;
  }) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status.toLowerCase() as 'pending' | 'completed',
      priority: task.priority.toLowerCase() as 'low' | 'medium' | 'high',
      dueDate: task.dueDate.toISOString(),
      createdAt: task.createdAt.toISOString(),
    };
  }

  private toPrismaStatus(status: 'pending' | 'completed' | undefined): TaskStatus {
    if (!status) return TaskStatus.PENDING;
    return status === 'completed' ? TaskStatus.COMPLETED : TaskStatus.PENDING;
  }

  private toPrismaPriority(priority: 'low' | 'medium' | 'high' | undefined): TaskPriority {
    if (!priority) return TaskPriority.MEDIUM;

    if (priority === 'low') return TaskPriority.LOW;
    if (priority === 'high') return TaskPriority.HIGH;

    return TaskPriority.MEDIUM;
  }

  private buildUserCacheKey(userId: string): string {
    return `tasks:user:${userId}`;
  }

  private async invalidateUserCache(userId: string): Promise<void> {
    await this.cache.del(this.buildUserCacheKey(userId));
  }
}
