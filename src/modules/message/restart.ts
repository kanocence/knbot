import { Injectable, Logger } from "@nestjs/common"
import { CommonEventData, GroupMessageEventData, MessageModule, PrivateMessageEventData } from "src"
import { BotService } from "src/service/bot.service"
import { messageEq } from "src/utils/event"

@Injectable()
export class RestartModule implements MessageModule {

  type: ['private', 'group']

  private logger = new Logger(RestartModule.name)

  constructor(private readonly botService: BotService) { }

  validator(msg: GroupMessageEventData | PrivateMessageEventData): boolean {
    return (global.config.admin as any[]).includes(msg.user_id) && messageEq(msg.message, 'bot restart')
  }

  processor(msg: CommonEventData): void {
    this.logger.log('bot restart: ' + msg.self_id)
    this.botService.set_restart(msg)
  }
}