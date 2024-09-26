import {
  IsString,
  IsNotEmpty,
  IsEnum,
  Length,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PersonDto } from '@/person/dto/person.dto';
import { UserRole } from '../interface/userRole';

export class CreateUserDto extends PersonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The username for user' })
  username: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({ description: 'The role for user' })
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({ description: 'The password for user' })
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: 'The status of the user' })
  status: boolean;
}
