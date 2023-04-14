import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { Education } from '../entities/education.entity';
import { Family } from '../entities/family.entity';
import { Level } from '../entities/level.entity';
import { Activity } from '../entities/activity.entity';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  identification: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsArray()
  @IsOptional()
  level?: Level[];

  @IsArray()
  @IsOptional()
  family?: Family[];

  @IsArray()
  @IsOptional()
  education?: Education[];

  @IsArray()
  @IsOptional()
  activity?: Activity[];
}
