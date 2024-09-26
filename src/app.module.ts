import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { TenantModule } from '@/tenant/tenant.module';
import { CountryModule } from './country/country.module';
import { ProvinceModule } from './province/province.module';
import { CantonModule } from './canton/canton.module';
import { ParishModule } from './parish/parish.module';
import { EmailModule } from '@/services/email/email.module';
import { TenantMiddleware } from '@/middlewares/tenant.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { QuoteModule } from './quote/quote.module';
import { TemplateModule } from './templates/template.module';
import { TemplateDefaultModule } from './templateDefault/templateDefault.module';
import { TemplateEnvModule } from './templateEnv/templateEnv.module';
import { TemplateActionModule } from './templateAction/templateAction.module';
import { SiteModule } from './site/site.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataBaseConfig } from '@/config/database.config';
import { join } from 'path';
import {
  I18nModule,
  AcceptLanguageResolver,
  CookieResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { EmailTemplatesModule } from './emailTemplates/emailTemplates.module';
import { UploadModule } from '@/upload/upload.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        ...dataBaseConfig,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ClientModule,
    CountryModule,
    ProvinceModule,
    CantonModule,
    ParishModule,
    TenantModule,
    QuoteModule,
    TemplateModule,
    TemplateDefaultModule,
    TemplateEnvModule,
    TemplateActionModule,
    EmailModule,
    EmailTemplatesModule,
    SiteModule,
    UploadModule,
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        fallbackLanguage: 'es',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude({ path: 'upload/get-logo/(.*)', method: RequestMethod.GET })
      .forRoutes('*');

    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST },
        { path: '/auth/request-reset-password', method: RequestMethod.PATCH },
        { path: 'auth/reset-password', method: RequestMethod.PATCH },
        { path: 'upload/get-logo/(.*)', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
