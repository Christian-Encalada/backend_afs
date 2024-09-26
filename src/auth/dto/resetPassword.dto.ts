import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token to reset password to a user',
  })
  resetPasswordToken: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    description: 'New password for the user',
  })
  password: string;
}
