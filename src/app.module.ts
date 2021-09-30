import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Modules } from './modules/modules';
import { BotService } from './service/bot.service';
import { MessageService } from './service/message.service';
import { MetaEventService } from './service/meta-event.service';
import { NoticeService } from './service/notice.service';
import { RequestService } from './service/request.service';
import { WsStartGateway } from './websocket/ws.getwary';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WsStartGateway, MetaEventService, RequestService, MessageService,
    NoticeService, Modules, BotService],
})
export class AppModule { }
