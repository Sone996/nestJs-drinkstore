import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserRequest, LoginRequest } from 'libs/dto/src';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUserById(userId: string) {
    try {
      const user = await this.prismaService.user.findFirstOrThrow({
        where: { id: userId },
      });
      return user;
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async userExist(email: string, password: string) {
    try {
      const existingUser = await this.prismaService.user.findFirst({
        where: { email: email },
      });

      if (!existingUser) {
        throw new Error('No user');
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password,
      );
      if (!passwordMatch) {
        throw new Error('Invalid password');
      }

      return existingUser.id;
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async login(user: LoginRequest) {
    try {
      const { email, password } = user;

      const id = await this.userExist(email, password);

      const payload = { username: email, password: password, userId: id };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async register(body: CreateUserRequest) {
    try {
      const { password, ...userData } = body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prismaService.user.create({
        data: { ...userData, password: hashedPassword },
      });

      return newUser;
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }
}
