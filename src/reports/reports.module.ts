import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportsAuthGuard } from './guards/reports-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ReportsService, ReportsAuthGuard],
  controllers: [ReportsController],
})
export class ReportsModule {}
