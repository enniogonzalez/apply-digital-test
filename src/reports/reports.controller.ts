import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReportsAuthGuard } from './guards/reports-auth.guard';
import { ReportsService } from './reports.service';
import { ReportFiltersDto } from './dtos/reports.dto';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(ReportsAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('percentage-products-deleted')
  @ApiOperation({ summary: 'Get percentage of products that are deleted' })
  @ApiResponse({
    status: 200,
    description: 'Percentage of products that are deleted',
  })
  async getPercentageProductsDeleted() {
    return {
      percentage: await this.reportsService.getPercentageProductsDeleted(),
    };
  }

  @Get('percentage-products-not-deleted')
  @ApiOperation({ summary: 'Get percentage of products that are not deleted' })
  @ApiResponse({
    status: 200,
    description: 'Percentage of products that are not deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'There is an error in the provided filters',
  })
  async getPercentageProductsNotDeleted(@Query() filters: ReportFiltersDto) {
    return {
      percentage:
        await this.reportsService.getPercentageProductsNotDeleted(filters),
    };
  }

  @Get('products-by-category')
  @ApiOperation({ summary: 'Get products grouped by category' })
  @ApiResponse({
    status: 200,
    description: 'Products grouped by category',
  })
  async getProductsByCategory() {
    return {
      result: await this.reportsService.getProductsByCategory(),
    };
  }
}
