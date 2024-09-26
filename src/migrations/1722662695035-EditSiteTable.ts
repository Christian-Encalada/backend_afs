import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditSiteTable1722662695035 implements MigrationInterface {
  name = 'EditSiteTable1722662695035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "site" ALTER COLUMN "status" SET DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "site" ALTER COLUMN "status" DROP DEFAULT`,
    );
  }
}
