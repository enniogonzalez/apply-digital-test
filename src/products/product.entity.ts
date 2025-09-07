import { Column, Entity } from 'typeorm';

export enum ProductStatus {
  Active = 'Active',
  Deleted = 'Deleted',
}

@Entity('products')
export class Product {
  @Column('varchar', { primary: true, length: 50 })
  id: string;

  @Column('varchar', { unique: true, length: 50 })
  sku: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.Active })
  status: ProductStatus;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deletionDate?: Date;
  @Column()
  model: string;

  @Column()
  category: string;

  @Column()
  color: string;

  @Column('decimal')
  price: number;

  @Column()
  currency: string;

  @Column('int')
  stock: number;
}
