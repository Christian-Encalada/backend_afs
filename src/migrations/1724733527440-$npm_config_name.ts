import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1724733527440 implements MigrationInterface {
  name = ' $npmConfigName1724733527440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_a01abc9fee130e83b2d92a75bfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_3b9846bbadf4b8532031dc789c2"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_3b9846bbadf4b8532031dc789c2" UNIQUE ("tenantId", "name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_a01abc9fee130e83b2d92a75bfb" UNIQUE ("tenantId", "lastName")`,
    );
  }
}
