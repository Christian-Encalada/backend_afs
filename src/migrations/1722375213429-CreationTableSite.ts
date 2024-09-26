import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreationTableSite1722375213429 implements MigrationInterface {
  name = 'CreationTableSite1722375213429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "site" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text, "primaryColor" text, "secondaryColor" text, "logo" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean NOT NULL DEFAULT true, "tenantId" integer, CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD CONSTRAINT "FK_a7f29608ea92b2c7c6fdf2f8285" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "site" DROP CONSTRAINT "FK_a7f29608ea92b2c7c6fdf2f8285"`,
    );
    await queryRunner.query(`DROP TABLE "site"`);
  }
}
