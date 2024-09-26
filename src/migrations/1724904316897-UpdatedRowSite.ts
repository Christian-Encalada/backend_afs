import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedRowSite1724904316897 implements MigrationInterface {
  name = 'UpdatedRowSite1724904316897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "site" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "updatedAt"`);
  }
}
