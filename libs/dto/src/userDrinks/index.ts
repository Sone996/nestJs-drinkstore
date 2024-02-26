import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { UserDrinks as PrismaUserDrinks } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDrinks implements PrismaUserDrinks {
  @ApiProperty({ type: String, description: 'Self API ID.' })
  @IsString()
  id: string | null;

  @ApiProperty({ type: String, description: 'User ID.' })
  @IsString()
  userId: string;

  @ApiProperty({ type: String, description: 'drink ID.' })
  @IsString()
  drinkId: string;

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

export class CreateUserDrinksRequest extends PickType(UserDrinks, [
  'userId',
] as const) {
  @ApiProperty({ type: String, isArray: true, description: 'Drink ID.' })
  drinkIds: string[];
}

export class CreateuserDrinksResponse extends PickType(UserDrinks, [
  'id',
] as const) {}

export class GetUserDrinksQuery {
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

export class UpdateuserDrinksRequest extends PartialType(
  PickType(UserDrinks, ['userId'] as const),
) {
  @ApiProperty({ type: String, isArray: true, description: 'Drink ID.' })
  drinkIds: string[];
}
