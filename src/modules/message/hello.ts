import { Injectable } from "@nestjs/common"
import { GroupMessageEventData, MessageModule } from "src"
import { messageOp } from "src/utils/event"
import { BotService } from "src/service/bot.service"

@Injectable()
export class HelloModule implements MessageModule {

  type: 'group'

  constructor(private readonly botService: BotService) { }

  validator(msg: GroupMessageEventData): boolean {
    return messageOp(msg.message, '在吗')
  }

  processor(msg: GroupMessageEventData): void {
    this.botService.send_group_msg(msg, msg.group_id, 'w')
  }
}