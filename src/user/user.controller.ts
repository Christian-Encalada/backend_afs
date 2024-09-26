import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Param,
  Get,
  Query,
  UseGuards,
  Request,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUserDto } from './dto/getUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LocalAuthGuard } from '@/auth/auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(LocalAuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getUser(
    @Param('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<GetUserDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.user.fetching_user', { args: { id }, lang }),
    );
    try {
      return this.userService.findByOneById(+id);
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.user.user_not_found', { args: { id }, lang }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.user.user_not_found', { lang }),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Request() req,
    @I18n() i18n: I18nContext,
  ): Promise<GetUserDto> {
    const lang = i18n.lang;
    const tenantId = req.user.tenantId;
    this.logger.log(await i18n.t('messages.user.creating_user', { lang }));
    try {
      const user = await this.userService.createUser(createUserDto, +tenantId);
      this.logger.log(await i18n.t('messages.user.user_created', { lang }));
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        await i18n.t('errors.user.user_creation_error', { lang }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.user.user_creation_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<GetUserDto> {
    const lang = i18n.lang;

    this.logger.log(
      await i18n.t('messages.user.updating_user', { args: { id }, lang }),
    );

    try {
      const updatedUser = await this.userService.updateUser(+id, updateUserDto);
      this.logger.log(
        await i18n.t('messages.user.user_updated', {
          args: { id },
          lang,
        }),
      );
      return updatedUser;
    } catch (error) {
      // Ver si el error es una excepción HTTP lanzada en los servicios
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        await i18n.t('errors.user.user_update_error', {
          args: { id },
          lang,
        }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.user.user_update_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of users' })
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'createdAt', required: false, type: String })
  @ApiQuery({ name: 'document', required: false })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'province', required: false })
  @ApiQuery({ name: 'canton', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return paginated users.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getUsers(
    @Request() req,
    @I18n() i18n: I18nContext,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
    @Query('username') username?: string,
    @Query('role') role?: string,
    @Query('status') status?: boolean,
    @Query('createdAt') createdAt?: string,
    @Query('document') document?: string,
    @Query('country') country?: string,
    @Query('province') province?: string,
    @Query('canton') canton?: string,
  ): Promise<{ UsersPaginated: any; total: number }> {
    const tenantId = req.user.tenantId;
    try {
      return await this.userService.getUsersPaginated(
        +tenantId,
        page,
        limit,
        username,
        role,
        status,
        createdAt,
        document,
        country,
        province,
        canton,
      );
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.internal_server_error', { lang: i18n.lang }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.internal_server_error', { lang: i18n.lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(
    @Param('id') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<void> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.user.deleting_user', { args: { id }, lang }),
    );

    try {
      await this.userService.deleteUser(+id);
      this.logger.log(
        await i18n.t('messages.user.user_deleted', {
          args: { id },
          lang,
        }),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        await i18n.t('errors.user.user_deletion_error', {
          args: { id },
          lang,
        }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.user.user_deletion_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/reset_password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({
    status: 200,
    description: 'Password has been reset successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async resetPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
    @I18n() i18n: I18nContext,
  ): Promise<void> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.user.resetting_password', { args: { id }, lang }),
    );

    try {
      await this.userService.resetPassword(+id, newPassword);
      this.logger.log(
        await i18n.t('messages.user.password_reset_successful', {
          args: { id },
          lang,
        }),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        await i18n.t('errors.user.password_reset_failed', {
          args: { id },
          lang,
        }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.internal_server_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
