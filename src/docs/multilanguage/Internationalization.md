# i18n Implementation Guide in NestJS

## Introduction

Internationalization (i18n) is essential for applications that need to support multiple languages and localizations, allowing users from different regions and languages to use the application in their preferred language. In this project, we have used the `nestjs-i18n` library to manage internationalization efficiently and in a structured manner.

### Why Use the i18n Library?

1. **Ease of Use**: `nestjs-i18n` is an easy-to-integrate library with NestJS applications, offering simple configuration and powerful translation functionality.
2. **Compatibility**: The library integrates seamlessly with NestJS components such as controllers and services, allowing you to inject the translation service wherever needed.
3. **Multiple Language Handling**: Facilitates managing multiple translation files, allowing you to add and modify languages without hassle.
4. **Flexibility**: Supports language resolvers based on query strings, headers, cookies, and the language acceptance header, providing flexibility to determine the user's language.
5. **Agile Development**: Enables developers to update and maintain translations efficiently, improving productivity and ensuring the application is available to a global audience.

## Configuration

### Installation

To install the `nestjs-i18n` library, use the following command:

```bash
npm install nestjs-i18n
```
## Module Configuration
- This is a part of the configuration that must be added in the app.module.ts, to adapt the I18N library.
```bash
    import { join } from 'path';
    import {
    I18nModule,
    AcceptLanguageResolver,
    CookieResolver,
    QueryResolver,
    HeaderResolver,
    } from 'nestjs-i18n';

    @Module({
    imports: [
        // Otros módulos...
        I18nModule.forRootAsync({
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
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
    })
    export class AppModule {}
```
## Translation files.
- Within the structure of the project, the library is handled in this way.

```bash
i18n/
  en/
    errors.json
    messages.json
  es/
    errors.json
    messages.json
```
## Use in services.
- The library can be adapted in the serves or controllers files, this is an example of implementation in a service file.

```bash
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    private readonly i18n: I18nService,
    // Otros inyectables...
  ) {}

  async findOneByUsername(username: string): Promise<UserGetDto> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['tenant'],
    });

    if (!user) {
      const errorMsg = await this.i18n.translate('errors.user.user_not_found', {
        args: { username },
        lang: I18nContext.current().lang,
      });
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
```
## Use in controllers
- Now an example in the controllers.

```bash
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(
    @Body('senderName') senderName: string,
    @Body('senderEmail') senderEmail: string,
    @Body('recipientName') recipientName: string,
    @Body('recipientEmail') recipientEmail: string,
    @Body('subject') subject: string,
    @Body('htmlContent') htmlContent: string,
    @I18n() i18n: I18nContext,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.emailService.sendEmail(
        senderName,
        senderEmail,
        recipientName,
        recipientEmail,
        subject,
        htmlContent,
      );
      res.status(HttpStatus.OK).send();
    } catch (error) {
      const errorMessage = await i18n.t('errors.email.error_sending_email');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage,
      });
    }
  }
}
```