import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1720909746969 implements MigrationInterface {
  name = ' $npmConfigName1720909746969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "updateAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "updateAt" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "updateAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "updateAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
  }
}
