import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Category as PrismaCategory } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

export class Category implements PrismaCategory {
  @ApiProperty({ type: String, description: 'Category API ID.' })
  @IsString()
  id: string;

  @ApiProperty({ type: String, description: 'Category name' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: 'Category description' })
  @IsString()
  description: string;

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

  @ApiProperty({ type: String, description: 'Created by' })
  @IsString()
  createdBy: string;

  @ApiProperty({ type: String, description: 'Updated by' })
  @IsString()
  updatedBy: string;

  @ApiProperty({ type: Boolean, description: 'Is deleted' })
  @IsBoolean()
  deleted: boolean;

  @ApiProperty({ type: Boolean, description: 'Include drinks' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  drink: boolean;
}

export class CreateCategoryRequest extends PickType(Category, [
  'name',
  'description',
] as const) {}

export class CreateCategoryResponse extends PickType(Category, [
  'id',
] as const) {}

export class GetCategoryQuery extends PartialType(Category) {
  @ApiPropertyOptional({ type: Number, description: 'Current data limit.' })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => value * 1)
  limit?: number;

  @ApiPropertyOptional({ type: Number, description: 'Current data offset.' })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => value * 1)
  offset?: number;

  @ApiPropertyOptional({ type: Boolean, description: 'Include deleted.' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  deleted?: boolean;

  @ApiPropertyOptional({ type: Boolean, description: 'Include drinks.' })
  @IsBoolean()
  @IsOptional()
  drink?: boolean;
}

export class UpdateCategoryRequest extends PartialType(
  PickType(Category, ['name', 'description'] as const),
) {}
