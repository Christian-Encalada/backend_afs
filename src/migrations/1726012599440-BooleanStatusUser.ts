import { MigrationInterface, QueryRunner } from 'typeorm';

export class BooleanStatusUser1726012599440 implements MigrationInterface {
  name = ' BooleanStatusUser1726012599440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Asegúrate de eliminar cualquier columna "status" existente
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "status"`,
    );
    // Luego, agrega la columna "status" con el tipo boolean, valor por defecto true y la restricción NOT NULL
    await queryRunner.query(
      `ALTER TABLE "user" ADD "status" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_fc52434ee9440fcb15b198cf85f" UNIQUE ("tenantId", "email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_8c5fa6f1f2820ed6b535140dcc8" UNIQUE ("tenantId", "username")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_8c5fa6f1f2820ed6b535140dcc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_fc52434ee9440fcb15b198cf85f"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
  }
}
