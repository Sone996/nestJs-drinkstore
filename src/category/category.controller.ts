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
  ApiOAuth2,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Category,
  CreateCategoryRequest,
  GetCategoryQuery,
  UpdateCategoryRequest,
} from 'libs/dto/src';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { Jwt } from '../auth/decorators/jwt.decorator';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Category,
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard('jwt'))
  createCategory(@Body() body: CreateCategoryRequest, @Jwt() jwt: JwtPayload) {
    return this.categoryService.createCategory(body, jwt.sub);
  }

  @ApiOkResponse({
    description: 'Returns categories.',
    type: Category,
  })
  @Get('/')
  getCategories(@Query() params: GetCategoryQuery) {
    return this.categoryService.getCategories(params);
  }

  @ApiOkResponse({
    description: 'Returns the record single category.',
    type: Category,
  })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @ApiNoContentResponse({
    description: 'Updates the record.',
  })
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryRequest,
    @Jwt() jwt: JwtPayload,
  ) {
    return this.categoryService.updateCategory(id, body, jwt);
  }

  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
