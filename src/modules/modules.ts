import { Injectable } from "@nestjs/common";
import { MessageService } from "src/service/message.service";
import { MetaEventService } from "src/service/meta-event.service";
import { NoticeService } from "src/service/notice.service";
import { RequestService } from "src/service/request.service";
import { BiliLiveTaskModule } from "./message/live.task";
import restart from "./message/restart";
import setu from "./message/setu";


@Injectable()
export class Modules {

  constructor(private metaEventService: MetaEventService, private requestService: RequestService,
    private messageService: MessageService, private noticeService: NoticeService,
    private blTaskModule: BiliLiveTaskModule) {

    messageService.on(setu, ['group'])
    messageService.on(restart, ['group', 'private'])
    messageService.on(blTaskModule, ['group', 'private'])
  }
}