import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Delete(':id')
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 204,
    description: 'Product deleted successfully',
  })
  @HttpCode(204)
  async deleteProductById(@Param('id') id: string) {
    await this.productsService.deleteById(id);
  }

  @Delete('sku/:sku')
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 204,
    description: 'Product deleted successfully',
  })
  @HttpCode(204)
  async deleteProductBySku(@Param('sku') sku: string) {
    await this.productsService.deleteBySku(sku);
  }
}
