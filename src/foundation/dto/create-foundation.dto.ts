import { IsArray, IsOptional, IsString } from 'class-validator';
import { Member } from 'src/member/entities/member.entity';

export class CreateFoundationDto {
  @IsString()
  identification: string;

  @IsString()
  name: string;

  @IsString()
  adminEmail: string;

  @IsString()
  address: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  logo: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  members?: Member[];
}
