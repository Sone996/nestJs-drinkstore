import { Module } from '@nestjs/common';
import { DrinkController } from './drink.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DrinkService } from './drink.service';

@Module({
  imports: [PrismaModule],
  controllers: [DrinkController],
  providers: [DrinkService],
})
export class DrinkModule {}
