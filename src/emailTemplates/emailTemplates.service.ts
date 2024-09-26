import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class EmailTemplatesService {
  private readonly templatesPath: string;

  constructor(private readonly i18n: I18nService) {
    this.templatesPath = path.join(__dirname, 'templates');
  }

  async renderTemplate(templateName: string, context: any): Promise<string> {
    const lang = I18nContext.current().lang;
    const templatePath = path.join(this.templatesPath, `${templateName}.html`);

    if (!fs.existsSync(templatePath)) {
      throw new HttpException(
        await this.i18n.t('errors.render_template.error_rendering_template', {
          lang,
        }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    return template(context);
  }
}
