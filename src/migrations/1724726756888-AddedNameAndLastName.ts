import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1724726756888 implements MigrationInterface {
  name = ' $npmConfigName1724726756888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_f1cc158b99cc6249da053f372f0"`,
    );
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "person" ADD "name" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD "lastName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "name" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "lastName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_a01abc9fee130e83b2d92a75bfb" UNIQUE ("tenantId", "lastName")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_3b9846bbadf4b8532031dc789c2" UNIQUE ("tenantId", "name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_49d426be95b2ce9f8b39f8bece7" UNIQUE ("tenantId", "document")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_49d426be95b2ce9f8b39f8bece7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_3b9846bbadf4b8532031dc789c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_a01abc9fee130e83b2d92a75bfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "username" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD "username" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_f1cc158b99cc6249da053f372f0" UNIQUE ("username", "tenantId")`,
    );
  }
}
