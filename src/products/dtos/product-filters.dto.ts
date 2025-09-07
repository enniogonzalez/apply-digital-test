import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsDateString,
  Matches,
  IsEnum,
  Max,
  IsInt,
} from 'class-validator';

export enum ProductOrderBy {
  id = 'id',
  sku = 'sku',
  name = 'name',
  brand = 'brand',
  model = 'model',
  category = 'category',
  color = 'color',
  price = 'price',
  currency = 'currency',
  stock = 'stock',
  creationDate = 'creationDate',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ProductFiltersDto {
  @ApiProperty({
    description: 'Page number for pagination (starts from 1)',
    minimum: 1,
    default: 1,
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({
    description: 'Number of items per page (max 5)',
    minimum: 1,
    maximum: 5,
    default: 5,
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  limit: number;

  @ApiProperty({
    description: 'Order results by the specified field',
    enum: ProductOrderBy,
    default: ProductOrderBy.name,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(ProductOrderBy)
  orderBy: ProductOrderBy;

  @ApiProperty({
    description: 'Sort order for the results',
    enum: SortOrder,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(SortOrder)
  sortOrder: SortOrder;

  @ApiProperty({
    description: 'Unique identifier of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Stock Keeping Unit code of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Name of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Brand of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  brand?: string;

  @ApiProperty({
    description: 'Model of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  model?: string;

  @ApiProperty({
    description: 'Category of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Color of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  color?: string;

  @ApiProperty({
    description: 'Currency of the product price',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  currency?: string;

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

  @ApiProperty({
    description: 'Minimum stock of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minStock?: number;

  @ApiProperty({
    description: 'Maximum stock of the product',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxStock?: number;

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
}
