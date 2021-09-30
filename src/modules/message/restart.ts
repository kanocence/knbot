import { GroupMessageEventData, Module, PrivateMessageEventData, SendFunc } from "src"
import { messageEq } from "src/utils/event"

// 声明一个模块对象
const restart: Module = {
  /**
   * 验证收到的事件是否符合条件
   * @param msg 收的的消息对象
   * @returns 返回Boolean，表示事件是否符合需要处理的条件
   */
  validator(msg: GroupMessageEventData | PrivateMessageEventData): boolean {
    return msg.user_id == global.config.admin && messageEq(msg.message, 'bot restart')
  },
  /**
   * 处理器函数
   * @param msg 收的的消息对象
   * @param post 通知bot的函数，同直接注册事件时使用的`bot.sender.post`
   */
  processor(msg: any, send: SendFunc): void {
    send('set_restart', undefined, msg)
  }
}

// 导出你的模块
export default restart