import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { I18nService, I18nContext } from 'nestjs-i18n';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { RequestResetPasswordDto } from './dto/requestResetPassword.dto';
import { User } from '@/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@/services/email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const lang = I18nContext.current().lang;

    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      const errorMessage = await this.i18n.t('errors.user.user_not_found', {
        lang,
      });
      this.logger.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const errorMessage = await this.i18n.t(
        'errors.auth.invalid_credentials',
        { lang },
      );
      this.logger.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async login(user: any) {
    const lang = I18nContext.current().lang;

    try {
      const userData = await this.validateUser(user.username, user.password);

      const payload = {
        sub: userData.id,
        username: userData.username,
        tenantId: userData.tenant.id,
      };
      return {
        user: {
          id: userData.id,
          username: userData.username,
          role: userData.role,
          tenant: userData.tenant,
        },
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      // See if the user was not found or the credentials are invalid
      if (
        error.status === HttpStatus.NOT_FOUND ||
        error.status === HttpStatus.UNAUTHORIZED
      ) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(
          await this.i18n.t('errors.auth.login_error', { lang }),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Request to reset password
  async requestResetPassword(
    requestResetPassword: RequestResetPasswordDto,
  ): Promise<any> {
    const lang = I18nContext.current().lang;

    const { email } = requestResetPassword;

    try {
      const user = await this.userService.findOneByEmail(email);
      user.resetPasswordToken = v4();
      const resetPasswordToken = user.resetPasswordToken;

      await this.userRepository.save(user);

      this.logger.log(
        await this.i18n.t('messages.auth.token_reset_password_saved', {
          lang,
        }),
      );

      // Create the URL to send in the email
      const apiUrl = this.configService.get<string>('NEXT_PUBLIC_FRONTEND_URL');
      const resetPasswordUrl = `${apiUrl}/reset-password/${resetPasswordToken}`;

      this.logger.log(
        await this.i18n.t('messages.email.trying_create_email', {
          lang,
        }),
      );

      // Create the HTML content and send the email
      await this.emailService.sendResetPasswordEmail(
        email,
        user.username,
        resetPasswordUrl,
        lang,
      );

      this.logger.log(
        await this.i18n.t('messages.email.email_reset_send', {
          lang,
        }),
      );

      return {
        message: await this.i18n.t('messages.auth.token_reset_password_saved', {
          lang,
        }),
      };
    } catch (error) {
      // See if the user was not found
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(
          await this.i18n.t('errors.auth.request_reset_password', { lang }),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Reset the password
  async resetPassword(resetPassword: ResetPasswordDto): Promise<any> {
    const lang = I18nContext.current().lang;

    const { resetPasswordToken, password } = resetPassword;

    try {
      const user =
        await this.userService.findOneByResetPasswordToken(resetPasswordToken);

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = null;

      this.userRepository.save(user);

      this.logger.log(
        await this.i18n.t('messages.user.changed_password', {
          lang,
        }),
      );

      return {
        message: await this.i18n.t('messages.user.changed_password', {
          lang,
        }),
      };
    } catch (error) {
      // See if the user was not found
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(
          await this.i18n.t('errors.auth.login_error', { lang }),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
