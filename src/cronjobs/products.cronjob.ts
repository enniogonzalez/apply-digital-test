import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExternalProductsService } from 'src/external-products/external-products.service';
import { ProductsService } from 'src/products/products.service';
import { Product, ProductResponse } from 'src/types';

@Injectable()
export class ProductsCronJob {
  private readonly logger: Logger = new Logger(ProductsCronJob.name);
  constructor(
    private readonly externalProductsService: ExternalProductsService,
    private readonly productsService: ProductsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async saveProductsFromApplyDigital() {
    const promisesToSaveProducts: Promise<Product>[] = [];
    let productResponse: ProductResponse | null = null;
    let skip = 0;
    const limit = 10;
    do {
      productResponse =
        await this.externalProductsService.fetchExternalProducts(skip, limit);

      if (productResponse?.items?.length) {
        productResponse.items.forEach((item) =>
          promisesToSaveProducts.push(
            this.productsService.save({
              ...item.fields,
              id: item.sys.id,
              creationDate: new Date(item.sys.createdAt),
            }),
          ),
        );
      }
      skip += limit;
    } while (productResponse && productResponse?.items?.length > 0);

    await Promise.all(promisesToSaveProducts);
    this.logger.log(
      `Fetched ${promisesToSaveProducts.length} products from Apply Digital`,
    );
  }
}
