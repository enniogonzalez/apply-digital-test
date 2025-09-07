import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductStatus } from './product.entity';
import {
  FindOptionsWhere,
  ILike,
  Not,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { ProductFiltersDto } from './dtos/product-filters.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async save(product: Partial<Product>): Promise<Product> {
    return this.productRepository.save(product);
  }

  async deleteBySku(sku: string): Promise<void> {
    const result = await this.productRepository.update(
      { sku, status: Not(ProductStatus.Deleted) },
      { status: ProductStatus.Deleted, deletionDate: new Date() },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Product not found`);
    }
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.productRepository.update(
      { id, status: Not(ProductStatus.Deleted) },
      { status: ProductStatus.Deleted, deletionDate: new Date() },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Product not found`);
    }
  }

  async findAll(filters: ProductFiltersDto) {
    return await this.productRepository.find({
      where: this.buildWhereClause(filters),
      order: {
        [`${filters.orderBy ?? 'name'}`]: filters.sortOrder || 'ASC',
      },
      skip: ((filters.page || 1) - 1) * (filters.limit || 10),
      take: filters.limit || 5,
    });
  }

  private buildWhereClause(
    filters: ProductFiltersDto,
  ): FindOptionsWhere<Product> {
    const where: FindOptionsWhere<Product> = {
      status: Not(ProductStatus.Deleted),
    };

    for (const field of Object.keys(filters)) {
      if (filters?.[field] === undefined) continue;
      switch (field) {
        case 'id':
        case 'sku':
          where[field] = filters[field];
          break;
        case 'name':
        case 'brand':
        case 'model':
        case 'category':
        case 'color':
          where[field] = ILike(`%${filters[field]}%`);
          break;
        case 'minPrice':
          where['price'] = MoreThanOrEqual(filters[field]);
          break;
        case 'maxPrice':
          where['price'] = LessThanOrEqual(filters[field]);
          break;
        case 'minStock':
          where['stock'] = MoreThanOrEqual(filters[field]);
          break;
        case 'maxStock':
          where['stock'] = LessThanOrEqual(filters[field]);
          break;
        case 'minDate':
          where['createdAt'] = MoreThanOrEqual(
            this.getDateAtBeginningOfDay(filters[field]),
          );
          break;
        case 'maxDate':
          where['createdAt'] = LessThanOrEqual(
            this.getDateAtEndOfDay(filters[field]),
          );
          break;
        default:
          continue;
      }
    }

    return where;
  }

  private getDateAtBeginningOfDay(dateString: string): Date {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private getDateAtEndOfDay(dateString: string): Date {
    const date = new Date(dateString);
    date.setHours(23, 59, 59, 999);
    return date;
  }
}
