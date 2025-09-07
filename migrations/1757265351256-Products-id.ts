import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductsId1757265351256 implements MigrationInterface {
  name = 'ProductsId1757265351256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "id" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "PK_c44ac33a05b144dd0d9ddcf9327"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "PK_2062733f48d2131f2076a87876b" PRIMARY KEY ("sku", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "PK_2062733f48d2131f2076a87876b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "PK_c44ac33a05b144dd0d9ddcf9327" PRIMARY KEY ("sku")`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "id"`);
  }
}
