import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseCategory, Prisma } from '@prisma/client';
import { CacheService } from '../common/cache.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpensesService {
  private readonly cacheTtlSeconds = 60;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async getAll(userId: string) {
    const cacheKey = this.buildUserCacheKey(userId);
    const cached =
      await this.cache.getJson<
        ReturnType<ExpensesService['toExpenseResponse']>[]
      >(cacheKey);

    if (cached) {
      return cached;
    }

    const expenses = await this.prisma.expense.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const response = expenses.map((expense) => this.toExpenseResponse(expense));
    await this.cache.setJson(cacheKey, response, this.cacheTtlSeconds);

    return response;
  }

  async create(userId: string, dto: CreateExpenseDto) {
    const expense = await this.prisma.expense.create({
      data: {
        userId,
        title: dto.title,
        amount: dto.amount,
        category: this.toPrismaCategory(dto.category),
        date: new Date(dto.date),
      },
    });

    await this.invalidateUserCache(userId);
    return this.toExpenseResponse(expense);
  }

  async update(userId: string, expenseId: string, dto: UpdateExpenseDto) {
    const existingExpense = await this.prisma.expense.findFirst({
      where: { id: expenseId, userId },
    });

    if (!existingExpense) {
      throw new NotFoundException('Expense not found');
    }

    const data: Prisma.ExpenseUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.category !== undefined)
      data.category = this.toPrismaCategory(dto.category);
    if (dto.date !== undefined) data.date = new Date(dto.date);

    const updatedExpense = await this.prisma.expense.update({
      where: { id: expenseId },
      data,
    });

    await this.invalidateUserCache(userId);
    return this.toExpenseResponse(updatedExpense);
  }

  async delete(userId: string, expenseId: string) {
    const existingExpense = await this.prisma.expense.findFirst({
      where: { id: expenseId, userId },
    });

    if (!existingExpense) {
      throw new NotFoundException('Expense not found');
    }

    await this.prisma.expense.delete({ where: { id: expenseId } });
    await this.invalidateUserCache(userId);

    return { success: true };
  }

  private toExpenseResponse(expense: {
    id: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: Date;
    createdAt: Date;
  }) {
    return {
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      category: expense.category.toLowerCase() as
        | 'food'
        | 'transport'
        | 'entertainment'
        | 'utilities'
        | 'other',
      date: expense.date.toISOString(),
      createdAt: expense.createdAt.toISOString(),
    };
  }

  private toPrismaCategory(
    category: 'food' | 'transport' | 'entertainment' | 'utilities' | 'other',
  ): ExpenseCategory {
    if (category === 'food') return ExpenseCategory.FOOD;
    if (category === 'transport') return ExpenseCategory.TRANSPORT;
    if (category === 'entertainment') return ExpenseCategory.ENTERTAINMENT;
    if (category === 'utilities') return ExpenseCategory.UTILITIES;
    return ExpenseCategory.OTHER;
  }

  private buildUserCacheKey(userId: string): string {
    return `expenses:user:${userId}`;
  }

  private async invalidateUserCache(userId: string): Promise<void> {
    await this.cache.del(this.buildUserCacheKey(userId));
  }
}
