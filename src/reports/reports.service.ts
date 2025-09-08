import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductStatus } from 'src/products/product.entity';
import { Repository } from 'typeorm';
import { ReportFiltersDto } from './dtos/reports.dto';
import { getDateAtEndOfDay } from 'src/utils/date.utils';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getPercentageProductsDeleted(): Promise<number> {
    const result = await this.productRepository
      .createQueryBuilder('p')
      .select('COUNT(*)', 'total')
      .addSelect('p.status', 'status')
      .groupBy('p.status')
      .getRawMany<{ total: number; status: ProductStatus }>();

    const deletedProducts = Number(
      result.find((item) => item.status === ProductStatus.Deleted)?.total || 0,
    );
    const totalProducts = result.reduce(
      (acc, item) => acc + Number(item.total),
      0,
    );

    return Number(((deletedProducts / totalProducts) * 100).toFixed(2));
  }

  async getPercentageProductsNotDeleted(
    filters: ReportFiltersDto,
  ): Promise<number> {
    const query = this.productRepository
      .createQueryBuilder('p')
      .select('COUNT(*)', 'total')
      .addSelect('p.status', 'status')
      .groupBy('p.status');

    if (filters.minDate) {
      query.andWhere('p.createdAt >= :minDate', { minDate: filters.minDate });
    }
    if (filters.maxDate) {
      query.andWhere('p.createdAt <= :maxDate', {
        maxDate: getDateAtEndOfDay(filters.maxDate),
      });
    }
    if (filters.minPrice !== undefined) {
      query.andWhere('p.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      query.andWhere('p.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    const result = await query.getRawMany<{
      total: number;
      status: ProductStatus;
    }>();

    const notDeletedProducts =
      Number(
        result.find((item) => item.status !== ProductStatus.Deleted)?.total,
      ) || 0;
    const totalProducts = result.reduce(
      (acc, item) => acc + Number(item.total),
      0,
    );

    return totalProducts === 0
      ? 0
      : Number(((notDeletedProducts / totalProducts) * 100).toFixed(2));
  }

  async getProductsByCategory(): Promise<
    {
      products: number;
      stock: number;
      category: string;
    }[]
  > {
    return await this.productRepository
      .createQueryBuilder('p')
      .select('COUNT(*)', 'products')
      .addSelect('SUM(p.stock)', 'stock')
      .addSelect('p.category', 'category')
      .where('p.status != :status', { status: ProductStatus.Deleted })
      .groupBy('p.category')
      .getRawMany<{ products: number; stock: number; category: string }>();
  }
}
