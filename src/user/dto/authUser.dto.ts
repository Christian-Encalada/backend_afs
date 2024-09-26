import {
  IsString,
  IsNumber,
  ValidateNested,
  IsEmail,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TenantDto } from '@/tenant/dto/tenant.dto';

export class AuthUserDto {
  @IsNumber()
  @ApiProperty({ description: 'The id of the user' })
  id: number;

  @IsString()
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @IsString()
  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @IsEmail()
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @IsUUID('4')
  @ApiProperty({ description: 'Temporally token for recuperation password' })
  resetPasswordToken: string;

  @ValidateNested()
  @Type(() => TenantDto)
  @ApiProperty({ description: 'The tenant of the user' })
  tenant: TenantDto;
}
