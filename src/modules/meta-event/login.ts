import { Injectable } from "@nestjs/common"
import { CommonMetaEventData, MeatEventModule } from "src"
import { BotService } from "src/service/bot.service"

/** 上线时通知 */
@Injectable()
export class LoginModule implements MeatEventModule {

  type: 'lifecycle'

  constructor(private readonly botService: BotService) { }

  validator(msg: CommonMetaEventData): boolean {
    return msg.post_type === 'meta_event' && msg.meta_event_type === 'lifecycle'
  }

  processor(msg: CommonMetaEventData): void {
    (global.config.admin as any[]).forEach(i => {
      this.botService.send('send_private_msg',
        {
          user_id: i,
          message: 'bot login ' + msg.self_id
        },
        msg)
    })

  }
}