import { Injectable } from "@nestjs/common";
import { GroupMessageEventData, Message, MessageModule } from "src";
import { BotService } from "src/service/bot.service";
import { objectEquals } from "src/utils/event";

/**
 * 复读群消息
 */
@Injectable()
export class RepeatModule implements MessageModule {
  type: 'group'

  /** 记录复读相关的数据 */
  private data: {
    /** bot id */
    id: number
    groupId: number
    count: number
    message: Message[] | string
    /** 是否可以复读，复读一次后置为false */
    flag: boolean
  }[] = []

  constructor(private readonly botService: BotService) { }

  validator(msg: any) {
    return true
  }

  /** 处理和记录群消息 */
  processor(msg: GroupMessageEventData) {
    let item = this.data.find(i => i.groupId === msg.group_id && i.id === msg.self_id)
    if (item) {
      if (objectEquals(msg.message, item.message)) {
        item.count++
      } else {
        item.flag = true
        item.message = msg.message
        item.count = 0
      }
      if (this.ifRepeat(item)) {
        item.flag = false
        this.repeat(msg)
      }
    } else {
      let ni = {
        id: msg.self_id,
        groupId: msg.group_id,
        count: 0,
        message: msg.message,
        flag: true
      }
      if (this.ifRepeat(ni)) {
        ni.flag = false
        this.repeat(msg)
      }
      this.data.push(ni)
    }

  }

  /** 随机判断是否复读 */
  ifRepeat(data) {
    return data.flag && Math.random() * 5 < (data.count ?? 0.03)
  }

  /** 发送复读消息 */
  repeat(msg: GroupMessageEventData) {
    this.botService.send('send_group_msg', { group_id: msg.group_id, message: msg.message }, msg)
  }
}