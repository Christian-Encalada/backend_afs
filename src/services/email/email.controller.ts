import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { EmailService } from './email.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Response } from 'express';

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
