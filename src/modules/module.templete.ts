import { Injectable, Logger } from "@nestjs/common"
import { GroupMessageEventData, MessageModule, PrivateMessageEventData } from "src"
import { BotService } from "src/service/bot.service"

/**
 * 以处理私聊/群聊消息为例
 */
@Injectable()
export class YourModule implements MessageModule {

  /** 
   * 模块的注册类型 可选
   * 
   * 缺省时会注册为公共事件
   * 
   * 如果指定类型`'private'`就只会注册为私聊事件
   */
  type: ['private', 'group']

  private logger = new Logger(YourModule.name)

  /**
   * 构造方法，注入需要的类
   * @param botService 用于给bot发送消息  
   */
  constructor(private readonly botService: BotService) { }

  /**
   * 判断收到的消息是否需要处理
   * @param msg 收到的消息
   * @returns Boolean
   */
  validator(msg: GroupMessageEventData | PrivateMessageEventData): boolean {
    return false
  }

  /**
   * 具体的处理方法
   * @param msg 收到的消息
   */
  processor(msg: GroupMessageEventData | PrivateMessageEventData): void {
    this.logger.log('receive msg: ' + msg.message)

    // 通知bot发送消息
    // this.botService.send('send_group_msg', { group_id: 123, message: '收到' }, msg)
    // this.botService.send('send_private_msg', { user_id: 123, message: '收到' }, msg)
  }
}