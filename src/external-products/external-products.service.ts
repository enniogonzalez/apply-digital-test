import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductResponse } from 'src/types';

@Injectable()
export class ExternalProductsService {
  private readonly logger = new Logger(ExternalProductsService.name);
  constructor(private readonly configService: ConfigService) {}

  async fetchExternalProducts(
    skip = 0,
    limit = 10,
  ): Promise<ProductResponse | null> {
    const baseUrl = this.configService.get<string>('CDN_BASE_URL');
    const spaceId = this.configService.get<string>('AD_SPACE_ID');
    const environmentId = this.configService.get<string>('AD_ENVIRONMENT_ID');
    const accessToken = this.configService.get<string>('AD_ACCESS_TOKEN');
    const contentTypeId = this.configService.get<string>('AD_CONTENT_TYPE_ID');
    const params = new URLSearchParams({
      skip: `${skip}`,
      limit: `${limit}`,
      access_token: `${accessToken}`,
      content_type: `${contentTypeId}`,
    });

    const url = new URL(
      `/spaces/${spaceId}/environments/${environmentId}/entries`,
      baseUrl,
    );

    url.search = params.toString();

    const response = await fetch(url.toString());
    if (!response.ok) {
      this.logger.error(
        `Failed to fetch products: ${response.status} ${response.statusText}`,
      );
      return null;
    }
    return (await response.json()) as ProductResponse;
  }
}
