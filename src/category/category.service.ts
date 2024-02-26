import {
  CreateCategoryRequest,
  GetCategoryQuery,
  UpdateCategoryRequest,
} from 'libs/dto/src';
import { Injectable, Logger } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createCategory(
    body: CreateCategoryRequest,
    sub: string,
  ): Promise<Category> {
    try {
      const category = await this.prismaService.category.create({
        data: { ...body, createdBy: sub, updatedBy: sub },
      });
      return category;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getCategories(params: GetCategoryQuery): Promise<Category[]> {
    try {
      const { limit, offset, drink = false, ...where } = params;
      if (params.deleted) params.deleted = !!params.deleted;
      const categories = await this.prismaService.category.findMany({
        where,
        take: limit,
        skip: offset,
        include: { drink },
      });
      return categories;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await this.prismaService.category.findFirstOrThrow({
        where: {
          id,
        },
      });
      return category;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateCategory(
    id: string,
    body: UpdateCategoryRequest,
    jwt: JwtPayload,
  ): Promise<Category> {
    try {
      const category = await this.prismaService.category.update({
        data: { ...body, updatedBy: jwt.userId },
        where: { id },
      });
      return category;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      await this.prismaService.category.delete({
        where: { id },
      });
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
