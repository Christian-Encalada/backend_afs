import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTemplateRowInSite1726692497160 implements MigrationInterface {
  name = 'AddedTemplateRowInSite1726692497160';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."site_template_enum" AS ENUM('["#4E25BE", "#FFFFFF"]', '["#2990FF", "#FFFFFF"]')`,
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD "template" "public"."site_template_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "template"`);
    await queryRunner.query(`DROP TYPE "public"."site_template_enum"`);
  }
}
