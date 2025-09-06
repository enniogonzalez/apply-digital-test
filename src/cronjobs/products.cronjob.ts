import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExternalProductsService } from 'src/external-products/external-products.service';
import { Product, ProductResponse } from 'src/types';

@Injectable()
export class ProductsCronJob {
  private readonly logger: Logger = new Logger(ProductsCronJob.name);
  constructor(
    private readonly externalProductsService: ExternalProductsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async saveProductsFromApplyDigital() {
    let products: Product[] = [];
    let productResponse: ProductResponse | null = null;
    let skip = 0;
    const limit = 10;
    do {
      productResponse =
        await this.externalProductsService.fetchExternalProducts(skip, limit);

      if (productResponse?.items?.length) {
        products = products.concat(
          productResponse.items.map((item) => item.fields),
        );
      }
      skip += limit;
    } while (productResponse && productResponse?.items?.length > 0);

    this.logger.log(`Fetched ${products.length} products from Apply Digital`);

    // TODO: Save products to the database
  }
}
