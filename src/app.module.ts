import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { WsStartGateway } from './websocket/ws.getwary'
import { ScheduleModule } from '@nestjs/schedule'
import { Services } from './service'
import { Modules } from './modules'
import { Schedule } from './schedule'

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, WsStartGateway, ...Modules, ...Schedule, ...Services],
})
export class AppModule { }
