import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelations1721511709132 implements MigrationInterface {
  name = 'UpdateRelations1721511709132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "country" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "province" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "countryId" bigint NOT NULL, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "canton" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "provinceId" bigint NOT NULL, CONSTRAINT "PK_94ba12e979c1dc743e29b8e7f38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "parish" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "provinceId" bigint NOT NULL, "cantonId" bigint NOT NULL, CONSTRAINT "PK_6a7a7075856309e2fb8a749b5d8" PRIMARY KEY ("id"))`,
    );
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`DROP TABLE "parish"`);
    await queryRunner.query(`DROP TABLE "canton"`);
    await queryRunner.query(`DROP TABLE "province"`);
    await queryRunner.query(`DROP TABLE "country"`);
  }
}
