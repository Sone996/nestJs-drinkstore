import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  User,
} from 'libs/dto/src';
import { Jwt } from 'src/auth/decorators/jwt.decorator';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateUserResponse,
  })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  createUser(@Body() body: CreateUserRequest) {
    return this.userService.createUser(body);
  }

  @ApiOkResponse({
    description: 'Returns the rall users',
    type: User,
  })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getCurrentUser() {
    return this.userService.getUsers();
  }

  @ApiOkResponse({
    description: 'Returns single user',
    type: User,
  })
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @ApiNoContentResponse({
    description: 'Updates the record.',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserRequest,
    @Jwt() jwt: JwtPayload,
  ) {
    return this.userService.updateUser(id, body, jwt);
  }

  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete()
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
