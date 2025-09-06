import { Module } from '@nestjs/common';
import { ExternalProductsService } from './external-products.service';

@Module({
  providers: [ExternalProductsService],
  exports: [ExternalProductsService],
})
export class ExternalProductsModule {}
