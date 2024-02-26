import { Prisma } from '@prisma/client';

export const DeleteMiddleware = (): Prisma.Middleware => async (params, next) => {
  const utcString = new Date().toISOString();

  if (params.action == 'delete') {
    params.action = 'update';
    params.args.data = { deletedAt: utcString, deleted: true };
  }

  if (params.action == 'deleteMany') {
    params.action = 'updateMany';
    if (params.args.data != undefined) {
      params.args.data['deletedAt'] = utcString;
      params.args.data['deleted'] = true;
    } else {
      params.args['deletedAt'] = { deletedAt: utcString };
      params.args['deleted'] = { deleted: true };
    }
  }

  if (params.action == 'findUnique' || params.action == 'findFirst') {
    params.action = 'findFirst';
    params.args.where['deleted'] = false;
  }

  if (params.action == 'findMany') {
    if (params.args.where) {
      if (params.args.where.deleted == undefined) {
        // Exclude deleted records if they have not been explicitly requested
        params.args.where['deleted'] = false;
      }
      if (params.args.where.deleted == true) {
        params.args.where['deleted'] = undefined;
      }
    } else {
      params.args['where'] = { deletedAt: null };
    }
  }

  return next(params);
};
