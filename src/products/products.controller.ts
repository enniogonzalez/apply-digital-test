import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductFiltersDto } from './dtos/product-filters.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product to delete' })
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
  @ApiOperation({ summary: 'Delete a product by SKU' })
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

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of products' })
  @ApiResponse({
    status: 200,
    description: 'List of products',
  })
  @ApiResponse({
    status: 400,
    description: 'There is an error in the provided filters',
  })
  async getProducts(@Query() filters: ProductFiltersDto) {
    return {
      products: await this.productsService.findAll(filters),
    };
  }
}
