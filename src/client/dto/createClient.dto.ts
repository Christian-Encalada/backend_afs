import { PersonDto } from '@/person/dto/person.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto extends PersonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the person' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The last name of the person' })
  lastName: string;
}
