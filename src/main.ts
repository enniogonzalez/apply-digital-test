import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsCronJob } from './cronjobs/products.cronjob';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  // Execute the cron job immediately on startup, to make sure
  // that the database is populated without waiting for the first scheduled run.
  await app.get(ProductsCronJob).saveProductsFromApplyDigital();
}
bootstrap();
