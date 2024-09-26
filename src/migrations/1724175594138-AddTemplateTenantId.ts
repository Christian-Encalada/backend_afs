import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1724175594138 implements MigrationInterface {
  name = ' $npmConfigName1724175594138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "template" ALTER COLUMN "tenantId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD CONSTRAINT "FK_a47eaf8cef20601947135b568cd" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "template" DROP CONSTRAINT "FK_a47eaf8cef20601947135b568cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ALTER COLUMN "tenantId" SET NOT NULL`,
    );
  }
}
