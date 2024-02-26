import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import applicationConfig from './config/application.config';
import { DrinkModule } from './drink/drink.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserDrinksModule } from './user-drinks/user-drinks.module';
import { UserModule } from './user/user.module';
import { JwtMiddleware } from './utils/jwtMiddleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [applicationConfig] }),
    ConfigModule,
    PrismaModule,
    UserModule,
    AuthModule,
    CategoryModule,
    DrinkModule,
    UserDrinksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
