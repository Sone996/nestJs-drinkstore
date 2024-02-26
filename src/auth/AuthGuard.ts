import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('example')
export class ExampleController {
  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    // This route is protected and can only be accessed by authenticated users
    // The AuthGuard will automatically validate the JWT token and throw an error if it's invalid
    return 'This route is protected';
  }
}
