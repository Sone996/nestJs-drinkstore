import { Permission, Role } from '@eventmender/dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let payload = {
    email: 'mail@mail.com',
    firstName: 'name',
    lastName: 'last name',
    accountId: 'cl8n2bf3a00002v6pd8sis6hu',
    roles: [Role.Admin],
    password: 'password',
  };
  let jwt = { sub: 'auth0|633ffdff7ccf5156305c277f', 'event-mender.api/roles': [Permission.Admin] };
  let userId = 'cl8n2zdhc0001p8tayyhxp622';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            getCurrentUser: jest.fn(),
            getUserBySub: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            checkMail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('UserController#createUser', () => {
    it('should create user', async () => {
      await controller.createUser(payload);
      expect(service.createUser).toBeCalledWith(payload);
    });
  });

  describe('UserController#getCurrentUser', () => {
    it('should get user (self)', async () => {
      await controller.getCurrentUser(jwt);
      expect(service.getUserBySub).toBeCalledWith(jwt.sub);
    });
  });

  describe('UserController#updateUser', () => {
    it('should update user', async () => {
      await controller.updateUser(userId, payload, jwt);
      expect(service.updateUser).toBeCalledWith(userId, payload, jwt);
    });
  });

  describe('UserController#deleteUser', () => {
    it('should delete user', async () => {
      await controller.deleteUser(userId);
      expect(service.deleteUser).toBeCalledWith(userId);
    });
  });

  describe('UserController#checkMail', () => {
    it('should check if mail exist', async () => {
      const body = { email: 'mail@mail.com' };
      await controller.checkMail(body);
      expect(service.checkMail).toBeCalledWith(body);
    });
  });
});
