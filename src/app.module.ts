import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsStartGateway } from './websocket/ws.getwary';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WsStartGateway],
})
export class AppModule { }
