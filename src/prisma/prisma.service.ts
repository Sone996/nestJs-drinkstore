import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DeleteMiddleware } from './middlewares/delete.middleware';

import type { INestApplication, OnModuleInit } from '@nestjs/common';
import { DMMFClass } from '@prisma/client/runtime';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  _baseDmmf: DMMFClass;
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();

    this.$use(DeleteMiddleware());
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
