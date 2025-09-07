import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Delete(':id')
  @HttpCode(204)
  async deleteProductById(@Param('id') id: string) {
    await this.productsService.deleteById(id);
  }

  @Delete('sku/:sku')
  @HttpCode(204)
  async deleteProductBySku(@Param('sku') sku: string) {
    await this.productsService.deleteBySku(sku);
  }
}
