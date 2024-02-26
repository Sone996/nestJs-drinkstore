import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const globalPrefix = 'api';

  const applicationHost = configService.get('application.host');
  const applicationProtocol = 'http';
  const applicationPort = configService.get('application.port');
  const parsedApplicationPort = `:${configService.get('application.port')}`;
  const applicationUrl = `${applicationProtocol}://${applicationHost}${parsedApplicationPort}/${globalPrefix}`;

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Drinkstore API')
    .setDescription('Complete collection of Drinkstore API endpoints')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(applicationPort, () => {
    logger.log(`Drinkstore API running at ${applicationUrl}`);
    logger.log(`Dreinkstore API Swagger running at ${applicationUrl}/docs/`);
  });
}
bootstrap();
