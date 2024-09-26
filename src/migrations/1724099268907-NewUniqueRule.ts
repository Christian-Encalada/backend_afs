import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1724099268907 implements MigrationInterface {
  name = ' $npmConfigName1724099268907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" ADD "deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "UQ_e4475bde6806df5ab6999b47e5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "UQ_d2d717efd90709ebd3cb26b936c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_19385ccaeac3753e24d2eed6a4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_1bbf3de9d1d60bb648de1f21031" UNIQUE ("tenantId", "email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_f1cc158b99cc6249da053f372f0" UNIQUE ("tenantId", "username")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_f1cc158b99cc6249da053f372f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_1bbf3de9d1d60bb648de1f21031"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_19385ccaeac3753e24d2eed6a4d" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "UQ_d2d717efd90709ebd3cb26b936c" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "UQ_e4475bde6806df5ab6999b47e5b" UNIQUE ("username")`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "deleted"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "deleted"`);
  }
}
