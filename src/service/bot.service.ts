import { Injectable, Logger } from '@nestjs/common'
import { request } from 'src/utils/request';
import { AxiosResponse } from "axios"
import { ApiType, Bot, CommonEventData } from 'src';

@Injectable()
export class BotService {

  private readonly logger = new Logger(BotService.name)

  /**
   * 根据配置文件中地址给bot发送信息
   * @param type 发送的api类型
   * @param data api使用的参数
   * @param msg 消息原文对象
   */
  async send(type: ApiType, data: any, msg: CommonEventData | { self_id: number }): Promise<AxiosResponse<any>> {
    const { bots } = global.config
    const bot = bots.find((i: Bot) => i.id = msg.self_id)

    if (!bot) {
      this.logger.warn(`bot(${msg.self_id}) was not registered, msg:`, msg)
      return Promise.reject()
    }
    // this.logger.debug('request data :>> ', data)
    // return
    return await request({
      method: 'post',
      url: `${bot.url}/${type}${bot.token ? '?access_token=' + bot.token : ''}`,
      data: data
    }).then(res => {
      this.logger.debug('call bot success')
      return res
    }).catch(err => {
      this.logger.error('call bot reject')
      return Promise.reject(err)
    })
  }
}
