import { Injectable, Logger } from "@nestjs/common"
import { request } from "src/utils/request"
import { AxiosResponse } from "axios"
import { GroupMessageEventData, MessageModule } from "src"
import { messageOp } from "src/utils/event"
import { BotService } from "src/service/bot.service"

@Injectable()
export class SetuModule implements MessageModule {

  type: 'group'

  private logger = new Logger(SetuModule.name)

  constructor(private readonly botService: BotService) { }

  validator(msg: GroupMessageEventData): boolean {
    return messageOp(msg.message, '来张色图')
  }

  processor(msg: GroupMessageEventData): void {
    // 封装后的axios, 发送xhr请求
    request({
      method: 'get',
      url: "https://api.lolicon.app/setu/v2"
    }).then((res: AxiosResponse) => {
      if (res.data.length > 0) {
        this.logger.debug('setu res :>> ', res)
        this.botService.send_group_msg(msg, msg.group_id,
          res.data
            .map((i: { urls: { original: string } }) => i.urls?.original)
            .filter((i: string) => i)
            .map((i: string) => `[CQ:image,file=${i}]`)
            .join('\n'))
      }
    }).catch((error: any) => {
      this.logger.error(error)
      this.botService.send_group_msg(msg, msg.group_id, '查询出错')
    })
  }
}