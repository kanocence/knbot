import { Logger } from "@nestjs/common"
import { CommonEventData, GroupMessageEventData, MessageModule, PrivateMessageEventData } from "src"
import { BotService } from "src/service/bot.service"
import { messageEq } from "src/utils/event"

export class RestartModule implements MessageModule {

  type: ['private', 'group']

  private logger = new Logger(RestartModule.name)

  constructor(private readonly botService: BotService) { }

  validator(msg: GroupMessageEventData | PrivateMessageEventData): boolean {
    return msg.user_id == global.config.admin && messageEq(msg.message, 'bot restart')
  }

  processor(msg: CommonEventData): void {
    this.logger.log('bot restart: ' + msg.self_id)
    this.botService.send('set_restart', undefined, msg)
  }
}