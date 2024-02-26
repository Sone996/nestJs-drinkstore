import {
  CreateDrinkRequest,
  GetDrinkQuery,
  UpdateDrinkRequest,
} from 'libs/dto/src';
import { Injectable, Logger } from '@nestjs/common';
import { Drink } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Injectable()
export class DrinkService {
  private readonly logger = new Logger(DrinkService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createDrink(body: CreateDrinkRequest, sub: string): Promise<Drink> {
    try {
      const drink = await this.prismaService.drink.create({
        data: { ...body, createdBy: sub, updatedBy: sub },
      });
      return drink;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getDrinks(params: GetDrinkQuery): Promise<Drink[]> {
    try {
      const { limit, offset, ...where } = params;
      if (params.deleted) params.deleted = !!params.deleted;
      const drinks = await this.prismaService.drink.findMany({
        where,
        take: limit,
        skip: offset,
      });
      return drinks;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getDrinkById(id: string): Promise<Drink> {
    try {
      const drink = await this.prismaService.drink.findFirstOrThrow({
        where: {
          id,
        },
      });
      return drink;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateDrink(
    id: string,
    body: UpdateDrinkRequest,
    jwt: JwtPayload,
  ): Promise<Drink> {
    try {
      const drink = await this.prismaService.drink.update({
        data: { ...body, updatedBy: jwt.userId },
        where: { id },
      });
      return drink;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteDrink(id: string) {
    try {
      await this.prismaService.drink.delete({
        where: { id },
      });
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
