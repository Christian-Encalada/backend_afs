import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelationsTemplate1727203549682 implements MigrationInterface {
  name = 'RelationsTemplate1727203549682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "template_variable_map" ("template_id" integer NOT NULL, "env_id" integer NOT NULL, CONSTRAINT "PK_cd7a73a69cfc21d12ebb73cb5c6" PRIMARY KEY ("template_id", "env_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c5956398d8b99c46e094a960b0" ON "template_variable_map" ("template_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f1939c48cc29bcba64e4c363c1" ON "template_variable_map" ("env_id") `,
    );
    await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "action"`);
    await queryRunner.query(
      `ALTER TABLE "template" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "template" ADD "action_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "template_action" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template_action" ADD "status" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "template_env" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "template_env" ADD "status" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" DROP CONSTRAINT "FK_a47eaf8cef20601947135b568cd"`,
    );
    await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "template" ADD "status" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ALTER COLUMN "activate" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ALTER COLUMN "tenantId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD CONSTRAINT "FK_a47eaf8cef20601947135b568cd" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD CONSTRAINT "FK_652bee30050774ff7a8bc21da51" FOREIGN KEY ("action_id") REFERENCES "template_action"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "template_variable_map" ADD CONSTRAINT "FK_c5956398d8b99c46e094a960b04" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "template_variable_map" ADD CONSTRAINT "FK_f1939c48cc29bcba64e4c363c19" FOREIGN KEY ("env_id") REFERENCES "template_env"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "template_variable_map" DROP CONSTRAINT "FK_f1939c48cc29bcba64e4c363c19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template_variable_map" DROP CONSTRAINT "FK_c5956398d8b99c46e094a960b04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" DROP CONSTRAINT "FK_652bee30050774ff7a8bc21da51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" DROP CONSTRAINT "FK_a47eaf8cef20601947135b568cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ALTER COLUMN "tenantId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ALTER COLUMN "activate" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "template" ADD "status" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD CONSTRAINT "FK_a47eaf8cef20601947135b568cd" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "template_env" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "template_env" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "template_action" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template_action" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "action_id"`);
    await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "updateAt"`);
    await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "template" ADD "action" character varying`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f1939c48cc29bcba64e4c363c1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c5956398d8b99c46e094a960b0"`,
    );
    await queryRunner.query(`DROP TABLE "template_variable_map"`);
  }
}
