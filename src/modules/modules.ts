import { Injectable, Logger } from "@nestjs/common";
import { MessageService } from "src/service/message.service";
import { MetaEventService } from "src/service/meta-event.service";
import { NoticeService } from "src/service/notice.service";
import { RequestService } from "src/service/request.service";
import { RegisterMessageModules } from "./message";
import { RegisterNoticeModules } from "./notice";
import { RegisterRequestModules } from "./request";
import { RegisterMetaEventModules } from "./meta-event";


@Injectable()
export class RegisterModules {

  private logger = new Logger(RegisterModules.name)

  constructor(
    private metaEventService: MetaEventService, private requestService: RequestService,
    private messageService: MessageService, private noticeService: NoticeService,
    private registerMessage: RegisterMessageModules,
    private registerNotice: RegisterNoticeModules,
    private registerRequest: RegisterRequestModules,
    private registerMetaEvent: RegisterMetaEventModules,) {

    
    /**
     * 分别注册所有导出的方法
     */
    registerMessage.register().forEach((module) => {
      messageService.on(module as any)
    })

    registerNotice.register().forEach((module) => {
      noticeService.on(module as any)
    })

    registerRequest.register().forEach((module) => {
      requestService.on(module as any)
    })

    registerMetaEvent.register().forEach((module) => {
      metaEventService.on(module as any)
    })
  }
}