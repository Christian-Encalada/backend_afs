import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleUserNoNullable1722718736705 implements MigrationInterface {
  name = 'AddRoleUserNoNullable1722718736705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP NOT NULL`,
    );
  }
}
