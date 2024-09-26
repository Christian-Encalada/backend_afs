import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1722988125835 implements MigrationInterface {
  name = ' $npmConfigName1722988125835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "template" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "content" text NOT NULL, "tenantId" integer NOT NULL, "status" character varying NOT NULL, "activate" boolean NOT NULL, "action" character varying NOT NULL, CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "template_env" ("id" SERIAL NOT NULL, "env" character varying NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_8b76288f3e428a7509219eb0fe4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "template_default" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "content" text NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_bd6d9c154d91399a10665131daa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "template_action" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_652bee30050774ff7a8bc21da51" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "template_action"`);
    await queryRunner.query(`DROP TABLE "template_default"`);
    await queryRunner.query(`DROP TABLE "template_env"`);
    await queryRunner.query(`DROP TABLE "template"`);
  }
}
