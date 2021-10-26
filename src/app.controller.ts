import { Controller, Get, Query, Req, Response } from '@nestjs/common'
import { AppService } from './app.service'

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('test')
  getHello(): string {
    return this.appService.getHello()
  }

  /**
   * query bots list
   * @returns 
   */
  @Get('bot/list')
  async getBotList() {
    return await this.appService.getBotList()
  }

  /**
   * query bot groups && friends list
   * @param id 
   * @returns 
   */
  @Get('bot/details')
  async getBotDetails(@Query('id') id: string | number) {
    return await this.appService.getBotDetails(id)
  }
}
