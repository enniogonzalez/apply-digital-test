import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNotEmpty,
  IsDateString,
  Matches,
  IsNumber,
  Min,
} from 'class-validator';

export class ReportFiltersDto {
  @ApiProperty({
    description: 'Minimum date for product filter (format: AAAA-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in AAAA-MM-DD format.',
  })
  minDate?: string;

  @ApiProperty({
    description: 'Maximum date for product filter (format: AAAA-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in AAAA-MM-DD format.',
  })
  maxDate?: string;

  @ApiProperty({
    description: 'Minimum price of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
