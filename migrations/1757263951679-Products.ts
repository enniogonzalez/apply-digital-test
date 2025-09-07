import { MigrationInterface, QueryRunner } from 'typeorm';

export class Products1757263951679 implements MigrationInterface {
  name = 'Products1757263951679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."products_status_enum" AS ENUM('Active', 'Deleted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("sku" character varying(50) NOT NULL, "name" character varying NOT NULL, "brand" character varying NOT NULL, "status" "public"."products_status_enum" NOT NULL DEFAULT 'Active', "creationDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletionDate" TIMESTAMP WITH TIME ZONE, "model" character varying NOT NULL, "category" character varying NOT NULL, "color" character varying NOT NULL, "price" numeric NOT NULL, "currency" character varying NOT NULL, "stock" integer NOT NULL, CONSTRAINT "PK_c44ac33a05b144dd0d9ddcf9327" PRIMARY KEY ("sku"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
  }
}
