import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '@/tenant/tenant.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantService: TenantService,
    private readonly i18n: I18nService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const lang = (req.query.lang as string) || 'en';
    const tenantName = req.headers['x-tenant-id'] as string;

    if (!tenantName) {
      const errorMessage = await this.i18n.t(
        'errors.tenant.tenant_id_required',
        { lang },
      );
      return res.status(400).json({ statusCode: 400, message: errorMessage });
    }

    const tenant = await this.tenantService.findOneByName(tenantName);
    if (!tenant) {
      const errorMessage = await this.i18n.t('errors.tenant.tenant_not_found', {
        lang,
      });
      return res.status(404).json({ statusCode: 404, message: errorMessage });
    }

    req['tenant'] = tenant;
    next();
  }
}
