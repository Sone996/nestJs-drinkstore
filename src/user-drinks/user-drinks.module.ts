import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserDrinksController } from './user-drinks.controller';
import { UserDrinksService } from './user-drinks.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserDrinksController],
  providers: [UserDrinksService],
})
export class UserDrinksModule {}
