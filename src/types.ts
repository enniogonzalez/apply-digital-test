export type LinkTarget = 'Space' | 'Environment' | 'ContentType' | 'Tag';

export interface SysLink<T extends LinkTarget> {
  type: 'Link';
  linkType: T;
  id: string;
}

export interface SysSpaceLink {
  sys: SysLink<'Space'>;
}

export interface SysEnvironmentLink {
  sys: SysLink<'Environment'>;
}

export interface SysContentTypeLink {
  sys: SysLink<'ContentType'>;
}

export interface TagLink {
  sys: SysLink<'Tag'>;
}

export interface EntrySys {
  space: SysSpaceLink;
  id: string;
  type: 'Entry';
  createdAt: string;
  updatedAt: string;
  environment: SysEnvironmentLink;
  publishedVersion: number;
  revision: number;
  contentType: SysContentTypeLink;
  locale: string;
}

export interface Metadata {
  tags: TagLink[];
  concepts: TagLink[];
}

export interface Product {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
}

export interface Item {
  metadata: Metadata;
  sys: EntrySys;
  fields: Product;
}

export interface ProductResponse {
  sys: { type: 'Array' };
  total: number;
  skip: number;
  limit: number;
  items: Item[];
}
