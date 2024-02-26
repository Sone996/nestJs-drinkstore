import { CreateUserDrinksRequest, GetUserDrinksQuery } from 'libs/dto/src';
import { Injectable, Logger } from '@nestjs/common';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserDrinksService {
  private readonly logger = new Logger(UserDrinksService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createUserDrinks(body: CreateUserDrinksRequest, jwt: JwtPayload) {
    const { userId, drinkIds } = body;
    try {
      const matchingDeletedFeatures =
        await this.prismaService.userDrinks.findMany({
          where: {
            userId,
            drinkId: {
              in: drinkIds,
            },
            deleted: true,
          },
        });

      const matchingFeatureIds = matchingDeletedFeatures.map(
        (mdf) => mdf.drinkId,
      );

      if (matchingDeletedFeatures.length > 0) {
        const deletedPayload = matchingFeatureIds.map((id) =>
          this.prismaService.userDrinks.update({
            where: { userId_drinkId: { drinkId: id, userId } },
            data: { deleted: false, deletedAt: new Date().toISOString() },
          }),
        );

        await this.prismaService.$transaction(deletedPayload);
      }

      const filteredDrinksIds = drinkIds.filter(
        (fid) => !matchingFeatureIds.includes(fid),
      );

      const payload = filteredDrinksIds.map((id) => ({
        drinkId: id,
        userId: userId,
        createdBy: jwt.sub,
        updatedBy: jwt.sub,
      }));

      const userDrinks = await this.prismaService.userDrinks.createMany({
        data: payload,
      });

      return userDrinks;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getDrinksForUsers(id: string, params: GetUserDrinksQuery) {
    try {
      const { limit, offset, deleted } = params;
      const features = await this.prismaService.userDrinks.findMany({
        where: { userId: id, deleted: deleted },
        include: { drink: true },
        take: limit,
        skip: offset,
      });
      return features;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteDrinksForUser(body: CreateUserDrinksRequest) {
    const { userId, drinkIds } = body;
    try {
      const payload = drinkIds.map((id) =>
        this.prismaService.userDrinks.delete({
          where: { userId_drinkId: { drinkId: id, userId } },
        }),
      );
      await this.prismaService.$transaction(payload);

      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
