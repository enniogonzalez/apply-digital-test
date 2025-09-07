import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsCronJob } from './cronjobs/products.cronjob';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Apply Digital API')
    .setDescription('API documentation for Apply Digital coding test')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);

  // Execute the cron job immediately on startup, to make sure
  // that the database is populated without waiting for the first scheduled run.
  await app.get(ProductsCronJob).saveProductsFromApplyDigital();
}
bootstrap();
