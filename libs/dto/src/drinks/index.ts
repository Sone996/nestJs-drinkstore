import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Drink as PrismaDrink } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

export class Drink implements PrismaDrink {
  @ApiProperty({ type: String, description: 'Drink API ID' })
  @IsString()
  id: string;

  @ApiProperty({ type: String, description: 'Drink name' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: 'Drink description' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ type: String, description: 'Drink price' })
  @IsString()
  price: string;

  @ApiProperty({ type: Boolean, description: 'Drink availability' })
  @IsBoolean()
  available: boolean;

  @ApiProperty({ type: String, description: 'Deinks category' })
  @IsString()
  categoryId: string;

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
}

export class CreateDrinkRequest extends PickType(Drink, [
  'name',
  'price',
  'description',
  'categoryId',
] as const) {}

export class CreateDrinkResponse extends PickType(Drink, ['id' as const]) {}

export class GetDrinkQuery extends PartialType(Drink) {
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
}

export class UpdateDrinkRequest extends PartialType(
  PickType(Drink, ['name', 'description', 'price', 'available'] as const),
) {}
