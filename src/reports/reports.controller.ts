import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportsAuthGuard } from './guards/reports-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(ReportsAuthGuard)
@Controller('reports')
export class ReportsController {
  @Get('')
  getReports() {
    return 'reports';
  }
}
