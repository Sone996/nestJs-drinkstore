import { registerAs } from '@nestjs/config';

export enum Host {
  Local = 'localhost',
  Development = '',
  Staging = '',
  Production = '',
}

export enum Environment {
  Local = 'local',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

interface ApplicationConfig {
  port: number;
  host: Host;
  environment: Environment;
  swaggerCallback: string;
}

export default registerAs<ApplicationConfig>('application', () => ({
  port: parseInt(process.env.APPLICATION_PORT, 10),
  host: process.env.APPLICATION_HOST as Host,
  environment: process.env.APPLICATION_ENVIRONMENT as Environment,
  swaggerCallback: process.env.APPLICATION_SWAGGER_CALLBACK,
}));
