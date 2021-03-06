import { Injectable, Logger } from "@nestjs/common"
import { CommonEventData, GroupMessageEventData, MessageModule, PrivateMessageEventData } from "src";
import { BiliSpaceTask } from "src/schedule/space.task";
import { BotService } from "src/service/bot.service";
import { messageOp } from "src/utils/event";
import { request } from "src/utils/request";

@Injectable()
export class BiliSpaceTaskModule implements MessageModule {

  type: ['private', 'group']

  private logger = new Logger(BiliSpaceTaskModule.name)

  constructor(private biliSpaceTask: BiliSpaceTask,
    private readonly botService: BotService) { }

  validator(msg: CommonEventData): boolean {
    return msg.post_type === 'message' && messageOp((msg as GroupMessageEventData).message, 'bst')
  }

  async processor(msg: GroupMessageEventData | PrivateMessageEventData) {
    await this.handleEvent(msg).then(res => {
      this.botService.send('send_msg',
        {
          message: res,
          group_id: msg.message_type === 'group' ? msg.group_id : undefined,
          user_id: msg.message_type === 'private' ? msg.user_id : undefined
        }, msg)
    })
  }

  /**
   * 判断命令类型
   * @param msg msg
   * @returns reply: string
   */
  async handleEvent(msg: GroupMessageEventData | PrivateMessageEventData) {
    let reply = `bilibili-space-task\n- ls 订阅列表\n- ad <UID> 添加订阅\n- rm <UID> 取消订阅\n- help 帮助`
    let cmd = (msg.message as string).split(' ')
    if (cmd[1] === 'ls') {
      // 返回当前列表
      reply = this.biliSpaceTask.info(msg, msg.message_type === 'group' ? msg.group_id : msg.user_id)
    } else if (cmd[1] === 'ad') {
      if (cmd[2]) {
        await request({
          url: 'https://api.bilibili.com/x/space/acc/info?mid=' + parseInt(cmd[2]),
          method: 'get'
        }).then(async res => {
          if (res.data) {
            await this.biliSpaceTask.add(msg, parseInt(cmd[2]))
              .then(res => { reply = res })
          } else {
            reply = 'No UID found: ' + cmd[2]
          }
        })
      } else {
        reply = 'Unknown command'
      }
    } else if (cmd[1] === 'rm') {
      if (cmd[1]) {
        reply = this.biliSpaceTask.remove(msg, parseInt(cmd[2]))
      } else {
        reply = 'Unknown command'
      }
    }
    return reply
  }

}