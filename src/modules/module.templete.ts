import { Logger } from "@nestjs/common"
import { messageIn } from "src/utils/event"
import { Module, SendFunc } from ".."

// 声明一个模块对象
const yourModuleName: Module = {

  /**
   * 验证收到的事件是否符合条件
   * @param msg 收的的消息对象
   * @returns 返回Boolean，表示事件是否符合需要处理的条件
   */
  validator(msg: any): boolean {
    Logger.debug('我在处理群聊消息')
    // do something
    return messageIn(msg.message, '在吗')
  },
  /**
   * 处理器函数
   * @param msg 收的的消息对象
   * @param post 通知bot的函数，同直接注册事件时使用的`bot.sender.post`
   */
  processor(msg: any, send: SendFunc): void {
    // do something
    // ...
    // 通知机器人发送群消息
    // 注意 此处发送的消息不一定要原路返回，可以发给任意人/群
    send('send_group_msg', { message: 'w', group_id: msg.group_id }, msg)
  }
}

// 导出你的模块
export default yourModuleName