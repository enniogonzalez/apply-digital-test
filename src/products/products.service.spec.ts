import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product, ProductStatus } from './product.entity';
import {
  ProductFiltersDto,
  ProductOrderBy,
  SortOrder,
} from './dtos/product-filters.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockedProductRepository: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const repoMock: Partial<jest.Mocked<Repository<Product>>> = {
      save: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    mockedProductRepository = module.get(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('Should save a product', async () => {
      const product: Partial<Product> = { id: '1', name: 'Test' };
      mockedProductRepository.save.mockResolvedValue(product as Product);
      const result = await service.save(product);

      expect(mockedProductRepository.save).toHaveBeenCalled();
      expect(result).toBe(product);
    });
  });

  describe('deleteBySku', () => {
    it('Should mark a product as deleted when found', async () => {
      mockedProductRepository.update.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });
      await service.deleteBySku('ABC');
      expect(mockedProductRepository.update).toHaveBeenCalled();
      const [where, set] = mockedProductRepository.update.mock.calls[0];
      expect(where['sku']).toBe('ABC');
      expect(where['status']).toEqual(expect.any(Object));
      expect(set['status']).toBe(ProductStatus.Deleted);
      expect(set['deletionDate']).toBeInstanceOf(Date);
    });

    it('Should throw NotFoundException when trying to delete a non-existing product', async () => {
      mockedProductRepository.update.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });
      await expect(service.deleteBySku('NOPE')).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(mockedProductRepository.update).toHaveBeenCalled();
    });
  });

  describe('deleteById', () => {
    it('Should mark a product as deleted when found', async () => {
      mockedProductRepository.update.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });
      await service.deleteById('ID12345');
      expect(mockedProductRepository.update).toHaveBeenCalled();
      const [where, set] = mockedProductRepository.update.mock.calls[0];
      expect(where['id']).toBe('ID12345');
      expect(where['status']).toEqual(expect.any(Object));
      expect(set['status']).toBe(ProductStatus.Deleted);
      expect(set['deletionDate']).toBeInstanceOf(Date);
    });

    it('Should throw NotFoundException when trying to delete a non-existing product', async () => {
      mockedProductRepository.update.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });
      await expect(service.deleteById('NOPE')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockedProductRepository.update).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('Should apply defaults for order, pagination, and not-deleted filter', async () => {
      const items: Product[] = [];
      mockedProductRepository.find.mockResolvedValue(items);

      const filters = { page: 1, limit: 5 } as unknown as ProductFiltersDto;
      const result = await service.findAll(filters);

      expect(result).toBe(items);
      expect(mockedProductRepository.find).toHaveBeenCalled();
      const args = mockedProductRepository.find.mock.calls[0][0];
      expect(args?.order).toEqual({ name: 'ASC' });
      expect(args?.skip).toBe(0);
      expect(args?.take).toBe(5);
      expect(args?.where).toEqual({ status: expect.any(Object) });
    });

    it('Should apply text filters using ILike and pagination/order overrides', async () => {
      const items: Product[] = [];
      mockedProductRepository.find.mockResolvedValue(items);

      const filters: ProductFiltersDto = {
        page: 2,
        limit: 5,
        orderBy: ProductOrderBy.brand,
        sortOrder: SortOrder.DESC,
        name: 'phone',
        brand: 'Acme',
        model: 'X',
        category: 'Mobiles',
        color: 'Black',
      };

      await service.findAll(filters);

      const args = mockedProductRepository.find.mock.calls[0][0];
      expect(args?.order).toEqual({ brand: 'DESC' });
      expect(args?.skip).toBe(5);
      expect(args?.take).toBe(5);

      const where = args?.where;
      expect(where?.['name']?.['type']).toBe('ilike');
      expect(where?.['name']?.['value']).toBe('%phone%');
      expect(where?.['brand']?.['type']).toBe('ilike');
      expect(where?.['brand']?.['value']).toBe('%Acme%');
      expect(where?.['model']?.['type']).toBe('ilike');
      expect(where?.['model']?.['value']).toBe('%X%');
      expect(where?.['category']?.['type']).toBe('ilike');
      expect(where?.['category']?.['value']).toBe('%Mobiles%');
      expect(where?.['color']?.['type']).toBe('ilike');
      expect(where?.['color']?.['value']).toBe('%Black%');
    });

    it('Should apply price >= filter when minPrice is set', async () => {
      mockedProductRepository.find.mockResolvedValue([]);
      const filters: ProductFiltersDto = {
        page: 1,
        limit: 5,
        minPrice: 100,
        orderBy: ProductOrderBy.name,
        sortOrder: SortOrder.ASC,
      };
      await service.findAll(filters);
      const where = mockedProductRepository.find.mock.calls[0][0]?.where;
      expect(where?.['price']?.['type']).toBe('moreThanOrEqual');
      expect(where?.['price']?.['value']).toBe(100);
    });

    it('Should apply price <= filter when maxPrice is set', async () => {
      mockedProductRepository.find.mockResolvedValue([]);
      const filters: ProductFiltersDto = {
        page: 1,
        limit: 5,
        maxPrice: 500,
        orderBy: ProductOrderBy.name,
        sortOrder: SortOrder.ASC,
      };
      await service.findAll(filters);
      const where = mockedProductRepository.find.mock.calls[0][0]?.where;
      expect(where?.['price']?.['type']).toBe('lessThanOrEqual');
      expect(where?.['price']?.['value']).toBe(500);
    });

    it('Should apply stock >= filter when minStock is set', async () => {
      mockedProductRepository.find.mockResolvedValue([]);
      const filters: ProductFiltersDto = {
        page: 1,
        limit: 5,
        minStock: 10,
        orderBy: ProductOrderBy.name,
        sortOrder: SortOrder.ASC,
      };
      await service.findAll(filters);
      const where = mockedProductRepository.find.mock.calls[0][0]?.where;
      expect(where?.['stock']?.['type']).toBe('moreThanOrEqual');
      expect(where?.['stock']?.['value']).toBe(10);
    });

    it('Should apply stock <= filter when maxStock is set', async () => {
      mockedProductRepository.find.mockResolvedValue([]);
      const filters: ProductFiltersDto = {
        page: 1,
        limit: 5,
        maxStock: 50,
        orderBy: ProductOrderBy.name,
        sortOrder: SortOrder.ASC,
      };
      await service.findAll(filters);
      const where = mockedProductRepository.find.mock.calls[0][0]?.where;
      expect(where?.['stock']?.['type']).toBe('lessThanOrEqual');
      expect(where?.['stock']?.['value']).toBe(50);
    });

    it('Should apply minDate at start of day', async () => {
      mockedProductRepository.find.mockResolvedValue([]);
      const filters: ProductFiltersDto = {
        page: 1,
        limit: 5,
        minDate: '2024-01-10',
        orderBy: ProductOrderBy.name,
        sortOrder: SortOrder.ASC,
      };
      await service.findAll(filters);
      const where = mockedProductRepository.find.mock.calls[0][0]?.where;
      expect(where?.['createdAt']?.['type']).toBe('moreThanOrEqual');
      const d: Date = where?.['createdAt']?.['value'];
      expect(d.getHours()).toBe(0);
      expect(d.getMinutes()).toBe(0);
      expect(d.getSeconds()).toBe(0);
      expect(d.getMilliseconds()).toBe(0);
    });

    it('Should apply maxDate at end of day', async () => {
      mockedProductRepository.find.mockResolvedValue([]);
      const filters: ProductFiltersDto = {
        page: 1,
        limit: 5,
        maxDate: '2024-01-15',
        orderBy: ProductOrderBy.name,
        sortOrder: SortOrder.ASC,
      };
      await service.findAll(filters);
      const where = mockedProductRepository.find.mock.calls[0][0]?.where;
      expect(where?.['createdAt']?.['type']).toBe('lessThanOrEqual');
      const d: Date = where?.['createdAt']?.['value'];
      expect(d.getHours()).toBe(23);
      expect(d.getMinutes()).toBe(59);
      expect(d.getSeconds()).toBe(59);
      expect(d.getMilliseconds()).toBe(999);
    });
  });
});
