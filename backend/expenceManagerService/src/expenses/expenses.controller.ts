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
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  getExpenses(@Req() request: Request) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.expensesService.getAll(userId);
  }

  @Post()
  createExpense(@Req() request: Request, @Body() dto: CreateExpenseDto) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.expensesService.create(userId, dto);
  }

  @Patch(':id')
  updateExpense(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.expensesService.update(userId, id, dto);
  }

  @Delete(':id')
  deleteExpense(@Req() request: Request, @Param('id') id: string) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User context is missing');
    }

    return this.expensesService.delete(userId, id);
  }
}
