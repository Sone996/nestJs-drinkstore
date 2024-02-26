import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

export class User implements PrismaUser {
  @ApiProperty({ type: String, description: 'User API ID.' })
  @IsString()
  id: string;

  @ApiProperty({ type: String, description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'User first name' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ type: String, description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({ type: String, description: 'Created by' })
  @IsOptional()
  @IsString()
  createdBy: string | null;

  @ApiProperty({ type: String, description: 'Updated by' })
  @IsOptional()
  @IsString()
  updatedBy: string | null;

  @ApiProperty({
    type: String,
    description: 'Create UTC timestamp.',
  })
  @IsISO8601()
  createdAt: Date;

  @ApiProperty({
    type: String,
    description: 'Update UTC timestamp.',
  })
  @IsISO8601({})
  updatedAt: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Delete UTC timestamp.',
  })
  @IsOptional()
  @IsISO8601()
  deletedAt: Date | null;

  @ApiProperty({ type: Boolean, description: 'Is deleted' })
  @IsBoolean()
  deleted: boolean;
}

export class CreateUserRequest extends PickType(User, [
  'email',
  'name',
  'lastName',
  'password',
] as const) {
  @ApiProperty({
    type: String,
    description: 'User password',
  })
  @IsString()
  password: string;
}

export class CreateUserResponse extends PickType(User, ['id'] as const) {}

export class GetUsersQuery extends PartialType(User) {
  @ApiPropertyOptional({ type: Number, description: 'Current data limit.' })
  @IsInt()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: Number, description: 'Current data offset.' })
  @IsInt()
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ type: Boolean, description: 'Include deleted.' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  deleted?: boolean;
}

export class UpdateUserRequest extends PartialType(
  PickType(User, ['email', 'name', 'lastName'] as const),
) {}

export class LoginRequest extends PartialType(
  PickType(User, ['email', 'password'] as const),
) {}
