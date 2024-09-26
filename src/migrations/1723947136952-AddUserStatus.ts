import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1723947136952 implements MigrationInterface {
  name = ' $npmConfigName1723947136952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "status" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
  }
}
