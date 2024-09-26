import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEndPointUserAndClient1721670099965
  implements MigrationInterface
{
  name = 'AddEndPointUserAndClient1721670099965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check and drop columns if they exist
    const checkAndDropColumn = async (table: string, column: string) => {
      const result = await queryRunner.query(`
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = '${table}' AND column_name = '${column}'
            `);
      if (result.length > 0) {
        await queryRunner.query(
          `ALTER TABLE "${table}" DROP COLUMN "${column}"`,
        );
      }
    };

    await checkAndDropColumn('person', 'province');
    await checkAndDropColumn('person', 'canton');
    await checkAndDropColumn('person', 'parish');
    await checkAndDropColumn('person', 'country');
    await checkAndDropColumn('user', 'province');
    await checkAndDropColumn('user', 'canton');
    await checkAndDropColumn('user', 'parish');
    await checkAndDropColumn('user', 'country');
    await checkAndDropColumn('client', 'province');
    await checkAndDropColumn('client', 'canton');
    await checkAndDropColumn('client', 'parish');
    await checkAndDropColumn('client', 'country');

    // Add new columns and constraints
    await queryRunner.query(`ALTER TABLE "person" ADD "countryId" bigint`);
    await queryRunner.query(`ALTER TABLE "person" ADD "provinceId" bigint`);
    await queryRunner.query(`ALTER TABLE "person" ADD "cantonId" bigint`);
    await queryRunner.query(`ALTER TABLE "person" ADD "parishId" bigint`);
    await queryRunner.query(`ALTER TABLE "user" ADD "countryId" bigint`);
    await queryRunner.query(`ALTER TABLE "user" ADD "provinceId" bigint`);
    await queryRunner.query(`ALTER TABLE "user" ADD "cantonId" bigint`);
    await queryRunner.query(`ALTER TABLE "user" ADD "parishId" bigint`);
    await queryRunner.query(`ALTER TABLE "client" ADD "countryId" bigint`);
    await queryRunner.query(`ALTER TABLE "client" ADD "provinceId" bigint`);
    await queryRunner.query(`ALTER TABLE "client" ADD "cantonId" bigint`);
    await queryRunner.query(`ALTER TABLE "client" ADD "parishId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_bf0510b21dc6884eb1332e46d1c" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_5a0304dfa6f2c5f42c0881e1448" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_76f556b6b33e1c082e0143fc008" FOREIGN KEY ("cantonId") REFERENCES "canton"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_553134d44e952125e1f0edf9224" FOREIGN KEY ("parishId") REFERENCES "parish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_4aaf6d02199282eb8d3931bff31" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_e919016c871c3266b564dd696c1" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_da04f311730f16d0f2873212912" FOREIGN KEY ("cantonId") REFERENCES "canton"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_0ecc9798d8f8bd96fa5d2142d97" FOREIGN KEY ("parishId") REFERENCES "parish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_04bb228ff4efc28a979688ea745" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_5b3ac023b326cc392eb9803226a" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_3766440d65fc64c7b5e6ebe5b59" FOREIGN KEY ("cantonId") REFERENCES "canton"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_e474c2da26f08f945bf804a5d10" FOREIGN KEY ("parishId") REFERENCES "parish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_e474c2da26f08f945bf804a5d10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_3766440d65fc64c7b5e6ebe5b59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_5b3ac023b326cc392eb9803226a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_04bb228ff4efc28a979688ea745"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_0ecc9798d8f8bd96fa5d2142d97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_da04f311730f16d0f2873212912"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_e919016c871c3266b564dd696c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_4aaf6d02199282eb8d3931bff31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_553134d44e952125e1f0edf9224"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_76f556b6b33e1c082e0143fc008"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_5a0304dfa6f2c5f42c0881e1448"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_bf0510b21dc6884eb1332e46d1c"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "parishId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "cantonId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "provinceId"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "countryId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "parishId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cantonId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "provinceId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "countryId"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "parishId"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "cantonId"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "provinceId"`);
    await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "countryId"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "country" bigint`);
    await queryRunner.query(`ALTER TABLE "client" ADD "parish" bigint`);
    await queryRunner.query(`ALTER TABLE "client" ADD "canton" bigint`);
    await queryRunner.query(`ALTER TABLE "client" ADD "province" bigint`);
    await queryRunner.query(`ALTER TABLE "user" ADD "country" bigint`);
    await queryRunner.query(`ALTER TABLE "user" ADD "parish" bigint`);
    await queryRunner.query(`ALTER TABLE "user" ADD "canton" bigint`);
    await queryRunner.query(`ALTER TABLE "user" ADD "province" bigint`);
    await queryRunner.query(`ALTER TABLE "person" ADD "country" bigint`);
    await queryRunner.query(`ALTER TABLE "person" ADD "parish" bigint`);
    await queryRunner.query(`ALTER TABLE "person" ADD "canton" bigint`);
    await queryRunner.query(`ALTER TABLE "person" ADD "province" bigint`);
  }
}
