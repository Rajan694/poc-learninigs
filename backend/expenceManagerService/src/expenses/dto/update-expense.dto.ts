import { IsEnum, IsISO8601, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class UpdateExpenseDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsEnum(['food', 'transport', 'entertainment', 'utilities', 'other'])
  category?: 'food' | 'transport' | 'entertainment' | 'utilities' | 'other';

  @IsOptional()
  @IsISO8601()
  date?: string;
}
