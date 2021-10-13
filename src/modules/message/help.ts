import { Injectable } from "@nestjs/common"
import { GroupMessageEventData, MessageModule, PrivateMessageEventData } from "src"
import { messageEq } from "src/utils/event"
import { BotService } from "src/service/bot.service"

@Injectable()
export class HelloModule implements MessageModule {

  type: ['group', 'private']

  constructor(private readonly botService: BotService) { }

  validator(msg: GroupMessageEventData | PrivateMessageEventData): boolean {
    return messageEq(msg.message, 'help') || messageEq(msg.message, '帮助')
  }

  processor(msg: GroupMessageEventData | PrivateMessageEventData): void {
    this.botService.send('send_msg',
      {
        group_id: msg.message_type === 'group' ? msg.group_id : undefined,
        user_id: msg.message_type === 'group' ? undefined : msg.user_id,
        message: 'knbot\n- bst [args...]\n- blt [args...]\n-bot restart(admin)'
      },
      msg)
  }
}