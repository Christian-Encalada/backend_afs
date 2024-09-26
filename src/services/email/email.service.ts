import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { EmailTemplatesService } from '@/emailTemplates/emailTemplates.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailTemplatesService: EmailTemplatesService,
    private readonly i18n: I18nService,
  ) {}

  async sendEmail(
    senderName: string,
    senderEmail: string,
    recipientName: string,
    recipientEmail: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    const apiUrl = this.configService.get<string>('EMAIL_API_URL');
    const apiKey = this.configService.get<string>('EMAIL_API_KEY');

    const data = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: recipientEmail,
          name: recipientName,
        },
      ],
      subject,
      htmlContent,
    };

    try {
      await axios.post(apiUrl, data, {
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json',
        },
      });
    } catch (error) {
      const errorMessage = await this.i18n.t(
        'errors.email.error_sending_email',
        {
          lang: I18nContext.current().lang,
        },
      );
      throw new InternalServerErrorException(errorMessage, error.message);
    }
  }

  async sendResetPasswordEmail(
    email: string,
    username: string,
    resetPasswordUrl: string,
    lang: string,
  ): Promise<void> {
    // Making Urls
    const frontendUrl = this.configService.get<string>(
      'NEXT_PUBLIC_FRONTEND_URL',
    );
    const logoUrl = `${frontendUrl}/Logo-white.png`;

    // Data to insert into the template
    const context = {
      greeting: await this.i18n.t('messages.email.reset_password.greeting', {
        lang,
      }),
      username,
      receipt_request: await this.i18n.t(
        'messages.email.reset_password.receipt_request',
        { lang },
      ),
      reset_instruction: await this.i18n.t(
        'messages.email.reset_password.reset_instruction',
        { lang },
      ),
      url: resetPasswordUrl,
      reset_link_text: await this.i18n.t(
        'messages.email.reset_password.reset_link_text',
        { lang },
      ),
      thanks_planifia: await this.i18n.t(
        'messages.email.reset_password.thanks_planifia',
        { lang },
      ),
      ignore_email: await this.i18n.t(
        'messages.email.reset_password.ignore_email',
        { lang },
      ),
      logoUrl,
    };

    // Generate the final HTML content
    const htmlContent = await this.emailTemplatesService.renderTemplate(
      'resetPasswordEmail',
      context,
    );

    // Send the email with the generated content
    await this.sendEmail(
      'Afifsystem Group - Planifia App',
      'info@afifsystems.com',
      username,
      email,
      await this.i18n.t('messages.email.reset_password.subject', { lang }),
      htmlContent,
    );
  }
}
