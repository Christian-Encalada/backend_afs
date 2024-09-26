import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1723597415007 implements MigrationInterface {
  name = ' $npmConfigName1723597415007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "UQ_e4475bde6806df5ab6999b47e5b" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_19385ccaeac3753e24d2eed6a4d" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_19385ccaeac3753e24d2eed6a4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "UQ_e4475bde6806df5ab6999b47e5b"`,
    );
  }
}
