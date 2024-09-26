import { IsString, IsNumber } from 'class-validator';

export class TenantGetDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
