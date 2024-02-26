import { Auth0User, Permission, Role } from '@eventmender/dto';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountType } from '@prisma/client';
import { AuthService } from '../../auth/auth.service';
import { JwtPayload } from '../../auth/jwt.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadMediaService } from '../../upload-media/upload-media.service';
import { VendorService } from '../../vendor/vendor.service';
import { UserService } from '../user.service';
import awsConfig from '../../config/aws.config';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let auth: AuthService;
  let accountId: string = 'cl8n2bf3a00002v6pd8sis6hu';
  let createAuth0User = {
    email: 'mail@mail.com',
    firstName: 'name',
    lastName: 'last name',
    password: 'password',
  };
  let payload = {
    ...createAuth0User,
    roles: [Role.Admin],
    accountId,
  };
  let jwt: JwtPayload = { sub: 'auth0|633ffdff7ccf5156305c277f', 'event-mender.api/roles': [Permission.Admin] };
  let auth0user: Auth0User = {
    sub: 'string',
    firstName: 'string',
    lastName: 'string',
    pictureUrl: 'string | null',
    email: 'string',
    roles: [Role.Admin],
    permissions: ['admin'],
  };
  let userPromise = {
    id: 'cl96z6sk100083ixv9pgjuao9',
    sub: 'auth0|633ffdff7ccf5156305c277f',
    accountId: 'cl96z5i9900003ixvmxpvrm81',
    createdAt: '2022-10-13T11:26:27.601Z',
    updatedAt: '2022-10-13T11:26:27.601Z',
    deletedAt: null,
    deleted: false,
    email: 'nebojsa.ilic@hybrid-it.rs',
    lastName: 'Ilic',
    firstName: 'Nebojsa',
    pictureUrl:
      'https://s.gravatar.com/avatar/b73102c83a1f5bf1cdf3caf0b19b0e29?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fne.png',
    roles: [],
    permissions: [],
    account: { type: AccountType.Customer },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: awsConfig.KEY,
          useValue: {},
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUniqueOrThrow: jest.fn().mockResolvedValueOnce(userPromise),
              create: jest.fn().mockResolvedValueOnce(userPromise),
              findUnique: jest.fn().mockResolvedValueOnce(userPromise),
              delete: jest.fn(id => undefined),
            },
          },
        },
        {
          provide: AuthService,
          useValue: {
            getAuth0User: jest.fn().mockResolvedValueOnce({ ...auth0user, ...userPromise }),
            getAuth0UserByEmail: jest.fn().mockResolvedValueOnce(false),
            deleteAuth0User: jest.fn().mockResolvedValueOnce(undefined),
            updateAuth0Roles: jest.fn().mockResolvedValueOnce(null),
            updateAuth0User: jest.fn().mockResolvedValueOnce(null),
            createAuth0User: jest.fn().mockResolvedValueOnce({
              data: {
                accountId: accountId,
                sub: jwt.sub,
              },
              include: {
                account: true,
              },
            }),
          },
        },
        { provide: VendorService, useValue: {} },
        {
          provide: UploadMediaService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValueOnce({ ...auth0user, ...userPromise }),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    auth = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('UserService#getUserBySub', () => {
    it('should get user', async () => {
      const getUser = await service.getUserBySub(jwt.sub);
      expect(getUser).toEqual(userPromise);
    });
  });

  describe('UserService#createUser', () => {
    it('should create user', async () => {
      const createUser = await service.createUser(payload);
      expect(createUser).toEqual({ id: userPromise.id });
    });
  });

  describe('UserService#updateUser', () => {
    it('should update user', async () => {
      let payloadUpdateUser = {
        email: 'mail@mail.com',
        firstName: 'name',
        lastName: 'last name',
        roles: [Role.Admin],
      };
      const updateUser = await service.updateUser(userPromise.id, payloadUpdateUser, jwt);
      expect(updateUser).toEqual(undefined);
    });
  });

  describe('UserService#deleteUser', () => {
    it('should delete user', async () => {
      const deleteUser = await service.deleteUser(userPromise.id);
      expect(deleteUser).toEqual(undefined);
    });
  });

  describe('UserService#checkMail', () => {
    it('should check if mail exist', async () => {
      const payload = { email: 'mail@mail.com' };
      const checkMail = await service.checkMail(payload);
      expect(checkMail).toEqual(false);
    });
  });
});
