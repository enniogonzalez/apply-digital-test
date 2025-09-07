import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductStatus } from './product.entity';
import { Not, Repository } from 'typeorm';

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
}
