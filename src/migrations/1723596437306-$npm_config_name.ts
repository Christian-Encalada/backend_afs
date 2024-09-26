import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1723596437306 implements MigrationInterface {
  name = ' $npmConfigName1723596437306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" ADD "email" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "UQ_d2d717efd90709ebd3cb26b936c" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "email" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "UQ_d2d717efd90709ebd3cb26b936c"`,
    );
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "email"`);
  }
}
