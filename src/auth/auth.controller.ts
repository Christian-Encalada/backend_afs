import { Body, Controller, Logger, Patch, Post, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestResetPasswordDto } from './dto/requestResetPassword.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SiteController } from '@/site/site.controller';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(SiteController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'login' })
  @ApiResponse({
    status: 200,
    description: 'The user has been logged.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @Patch('request-reset-password')
  @ApiOperation({ summary: 'Request to reset password' })
  @ApiResponse({
    status: 200,
    description: 'The user has been reset password.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async requestResetPassword(
    @I18n() i18n: I18nContext,
    @Body() requestResetPassword: RequestResetPasswordDto,
  ): Promise<any> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.auth.request_reset_password', { lang }),
    );

    return this.authService.requestResetPassword(requestResetPassword);
  }

  @Patch('reset-password')
  @ApiOperation({ summary: 'change the password' })
  @ApiResponse({
    status: 200,
    description: 'The user has been reset password.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async resetPassword(
    @I18n() i18n: I18nContext,
    @Body() resetPassword: ResetPasswordDto,
  ): Promise<any> {
    const lang = i18n.lang;
    this.logger.log(await i18n.t('messages.auth.reseting_password', { lang }));

    return this.authService.resetPassword(resetPassword);
  }
}
