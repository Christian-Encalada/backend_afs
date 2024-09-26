import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1724177869305 implements MigrationInterface {
  name = '$npmConfigName1724177869305';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Paso 1: Agregar la columna "activate" permitiendo NULL
    await queryRunner.query(
      `ALTER TABLE "template_default" ADD "activate" boolean`,
    );

    // Paso 2: Actualizar todos los registros existentes para que tengan el valor true
    await queryRunner.query(
      `UPDATE "template_default" SET "activate" = true WHERE "activate" IS NULL`,
    );

    // Paso 3: Modificar la columna para que sea NOT NULL (sin valor predeterminado)
    await queryRunner.query(
      `ALTER TABLE "template_default" ALTER COLUMN "activate" SET NOT NULL`,
    );

    // Permitir valores NULL en la columna "action" de la tabla "template"
    await queryRunner.query(
      `ALTER TABLE "template" ALTER COLUMN "action" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir la restricción de la columna "action" a NOT NULL
    await queryRunner.query(
      `ALTER TABLE "template" ALTER COLUMN "action" SET NOT NULL`,
    );

    // Eliminar la columna "activate" de la tabla "template_default"
    await queryRunner.query(
      `ALTER TABLE "template_default" DROP COLUMN "activate"`,
    );
  }
}
