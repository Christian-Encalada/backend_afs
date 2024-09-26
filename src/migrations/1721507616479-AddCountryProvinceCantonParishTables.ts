import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountryProvinceCantonParishTables1721507616479
  implements MigrationInterface
{
  name = 'AddCountryProvinceCantonParishTables1721507616479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "country" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "province" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "countryId" bigint, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "canton" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "provinceId" bigint, CONSTRAINT "PK_94ba12e979c1dc743e29b8e7f38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "parish" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "provinceId" bigint, "cantonId" bigint, CONSTRAINT "PK_6a7a7075856309e2fb8a749b5d8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "quote" ADD "title" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "quote" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "quote" ADD "clientId" integer`);
    await queryRunner.query(
      `ALTER TABLE "province" ADD CONSTRAINT "FK_493e19852e51a27ff8e544fd8cc" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "canton" ADD CONSTRAINT "FK_42ad7d01382b9f79b3f59396453" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parish" ADD CONSTRAINT "FK_9ef0fa75a946634123db5c937c9" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "parish" ADD CONSTRAINT "FK_61cae2fbb94f0e003b15407646b" FOREIGN KEY ("cantonId") REFERENCES "canton"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quote" ADD CONSTRAINT "FK_8b8c48876f6fdcf3e143c41596b" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Optional: Update existing rows with default value if necessary
    await queryRunner.query(
      `UPDATE "quote" SET "title" = 'Default Title' WHERE "title" IS NULL`,
    );

    // Optional: Alter the column to set NOT NULL if necessary
    await queryRunner.query(
      `ALTER TABLE "quote" ALTER COLUMN "title" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quote" DROP CONSTRAINT "FK_8b8c48876f6fdcf3e143c41596b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parish" DROP CONSTRAINT "FK_61cae2fbb94f0e003b15407646b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "parish" DROP CONSTRAINT "FK_9ef0fa75a946634123db5c937c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "canton" DROP CONSTRAINT "FK_42ad7d01382b9f79b3f59396453"`,
    );
    await queryRunner.query(
      `ALTER TABLE "province" DROP CONSTRAINT "FK_493e19852e51a27ff8e544fd8cc"`,
    );
    await queryRunner.query(`ALTER TABLE "quote" DROP COLUMN "clientId"`);
    await queryRunner.query(`ALTER TABLE "quote" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "quote" DROP COLUMN "title"`);
    await queryRunner.query(`DROP TABLE "parish"`);
    await queryRunner.query(`DROP TABLE "canton"`);
    await queryRunner.query(`DROP TABLE "province"`);
    await queryRunner.query(`DROP TABLE "country"`);
  }
}
