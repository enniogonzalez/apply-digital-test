import { Module } from '@nestjs/common';
import { ProductsCronJob } from './products.cronjob';
import { ScheduleModule } from '@nestjs/schedule';
import { ExternalProductsModule } from 'src/external-products/external-products.module';

@Module({
  imports: [ScheduleModule.forRoot(), ExternalProductsModule],
  providers: [ProductsCronJob],
})
export class CronjobsModule {}
