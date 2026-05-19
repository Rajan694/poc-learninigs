import { IsEnum, IsISO8601, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsEnum(['food', 'transport', 'entertainment', 'utilities', 'other'])
  category!: 'food' | 'transport' | 'entertainment' | 'utilities' | 'other';

  @IsISO8601()
  date!: string;
}
