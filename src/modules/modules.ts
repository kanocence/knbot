import { Injectable } from "@nestjs/common";
import { MessageService } from "src/service/message.service";
import { MetaEventService } from "src/service/meta-event.service";
import { NoticeService } from "src/service/notice.service";
import { RequestService } from "src/service/request.service";
import { BiliLiveTaskModule } from "./message/live.task";
import { RestartModule } from "./message/restart";
import { SetuModule } from "./message/setu";
import { MessageModules } from "./message";


@Injectable()
export class Modules {

  constructor(
    private metaEventService: MetaEventService, private requestService: RequestService,
    private messageService: MessageService, private noticeService: NoticeService,
    private blTaskModule: BiliLiveTaskModule, private setuModule: SetuModule,
    private restartModule: RestartModule) {

    // MessageModules.forEach((module) => {
    //   messageService.on(module as any)
    // })
    messageService.on(setuModule)
    messageService.on(restartModule)
    messageService.on(blTaskModule)
  }
}