import { Expose } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class TenantDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;
}
