import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('cat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('mio')
  getHello(): string {
    return this.appService.getHello();
  }
}
