import { Injectable } from "@nestjs/common"
import { Bot, CommonMetaEventData, MeatEventModule } from "src"
import { BotService } from "src/service/bot.service"

@Injectable()
export class LifecycleModule implements MeatEventModule {

  type: ['lifecycle', 'heartbeat']

  bots: Bot[]

  constructor(private readonly botService: BotService) { 
    this.bots = []
  }

  validator(msg: CommonMetaEventData): boolean {
    return msg.post_type === 'meta_event'
  }

  processor(msg: CommonMetaEventData): void {
    if (msg.meta_event_type === 'lifecycle') {
      (global.config.admin as any[]).forEach(i => {
        this.botService.send_private_msg(msg, i, 'bot login ' + msg.self_id)
      })
      let cache = this.bots.find(i => i.id === msg.self_id)
      if (cache) {
        cache.last_lifecycle = new Date().getTime()
        cache.beats = 0
        cache.last_beat = 0
      } else {
        let { id, url, token } = global.config.bots.find((i: Bot) => i.id === msg.self_id)
        this.bots.push({
          id: id,
          url: url,
          online: true,
          token: token,
          last_lifecycle: new Date().getTime(),
          last_beat: 0,
          beats: 0
        })
      }
    } else if (msg.meta_event_type === 'heartbeat') {
      let bot = this.bots.find(i => i.id === msg.self_id)
      bot.last_beat = new Date().getTime()
      bot.beats++
    }
  }
}