import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const lang = (req.query.lang as string) || 'en';
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const errorMessage = await this.i18n.t(
        'errors.auth.authorization_header_not_found',
        { lang },
      );
      return res.status(401).json({ statusCode: 401, message: errorMessage });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      const errorMessage = await this.i18n.t('errors.auth.token_not_found', {
        lang,
      });
      return res.status(401).json({ statusCode: 401, message: errorMessage });
    }

    try {
      const secret = this.configService.get<string>('SECRET_KEY_JWT');
      jwt.verify(token, secret);
      next();
    } catch (err) {
      const errorMessage = await this.i18n.t('errors.auth.invalid_token', {
        lang,
      });
      return res.status(401).json({ statusCode: 401, message: errorMessage });
    }
  }
}
