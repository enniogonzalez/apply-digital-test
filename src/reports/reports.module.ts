import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportsAuthGuard } from './guards/reports-auth.guard';

@Module({
  providers: [ReportsService, ReportsAuthGuard],
  controllers: [ReportsController],
})
export class ReportsModule {}
