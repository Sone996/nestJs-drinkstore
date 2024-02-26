import {
  CreateUserDrinksRequest,
  GetUserDrinksQuery,
  UserDrinks,
} from 'libs/dto/src';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Jwt } from '../auth/decorators/jwt.decorator';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { UserDrinksService } from './user-drinks.service';

@ApiTags('User Drinks')
@Controller('user-drinks')
export class UserDrinksController {
  constructor(private readonly userDrinksService: UserDrinksService) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserDrinks,
  })
  @ApiOAuth2([])
  @Post()
  @UseGuards(AuthGuard('jwt'))
  createUserDrink(
    @Body() body: CreateUserDrinksRequest,
    @Jwt() jwt: JwtPayload,
  ) {
    return this.userDrinksService.createUserDrinks(body, jwt);
  }

  @ApiOkResponse({
    description: 'Returns user drinks.',
    type: UserDrinks,
  })
  @ApiOAuth2([])
  @Get(':user_id')
  @UseGuards(AuthGuard('jwt'))
  getDrinksForUsers(
    @Param('user_id') id: string,
    @Query() params: GetUserDrinksQuery,
  ) {
    return this.userDrinksService.getDrinksForUsers(id, params);
  }

  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiOAuth2([])
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  deleteDrinksForUser(@Body() body: CreateUserDrinksRequest) {
    return this.userDrinksService.deleteDrinksForUser(body);
  }
}
