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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Drink,
  CreateDrinkRequest,
  GetDrinkQuery,
  UpdateDrinkRequest,
} from 'libs/dto/src';
import { DrinkService } from './drink.service';
import { AuthGuard } from '@nestjs/passport';
import { Jwt } from '../auth/decorators/jwt.decorator';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@ApiTags('Drink')
@Controller('drink')
export class DrinkController {
  constructor(private readonly drinkService: DrinkService) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Drink,
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard('jwt'))
  createDrink(@Body() body: CreateDrinkRequest, @Jwt() jwt: JwtPayload) {
    return this.drinkService.createDrink(body, jwt.sub);
  }

  @ApiOkResponse({
    description: 'Returns drinks.',
    type: Drink,
  })
  @Get('/')
  getDrinks(@Query() params: GetDrinkQuery) {
    return this.drinkService.getDrinks(params);
  }

  @ApiOkResponse({
    description: 'Returns the record single drink.',
    type: Drink,
  })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getDrinkById(@Param('id') id: string) {
    return this.drinkService.getDrinkById(id);
  }

  @ApiNoContentResponse({
    description: 'Updates the record.',
  })
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  updateDrink(
    @Param('id') id: string,
    @Body() body: UpdateDrinkRequest,
    @Jwt() jwt: JwtPayload,
  ) {
    return this.drinkService.updateDrink(id, body, jwt);
  }

  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  deleteDrink(@Param('id') id: string) {
    return this.drinkService.deleteDrink(id);
  }
}
