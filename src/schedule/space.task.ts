import { Injectable, Logger } from "@nestjs/common"
import { Cron, Interval } from "@nestjs/schedule"
import { BotService } from "src/service/bot.service"
import { request } from "src/utils/request"
import { BiliSpaceTaskData, SpaceApiResponse } from "./task"
import * as path from 'path'
import * as fs from 'fs'
import { CommonEventData, GroupMessageEventData, PrivateMessageEventData } from "src"
import { ScreenShotUtil } from "src/utils/screenshot"

// 接口实体参考 https://github.com/SocialSisterYi/bilibili-API-collect/issues/143#%E5%8A%A8%E6%80%81%E8%AF%A6%E6%83%85%E5%AF%B9%E8%B1%A1

@Injectable()
export class BiliSpaceTask {

  private readonly logger = new Logger(BiliSpaceTask.name)

  private configFileName = 'bilibili-space-task-config.json'

  private taskList: BiliSpaceTaskData[] = []

  constructor(private readonly botService: BotService, private readonly screenShotUtil: ScreenShotUtil) {
    // 读取配置文件
    let config: BiliSpaceTaskData[] | undefined = this.getConfig()
    if (config) {
      // 时间戳更新为当前时间(忽略启动前的动态)
      let now = new Date().getTime() / 1000
      config.forEach(conf => {
        conf.timestamp = now
        this.taskList.push(conf)
      })
    }
    this.logger.log('create bilibili space task, length: ' + this.taskList.length)
  }

  @Interval(60000)
  update() {
    this.setConfig()
  }

  /**
   * 定时任务 每2秒执行一次，如果一分钟执行不完则增加每次的执行个数
   * @returns 
   */
  @Interval(3000)
  async handleInterval() {
    let n = Math.ceil(this.taskList.length / 20)
    while (n >= 1) {
      let task: BiliSpaceTaskData = this.taskList.shift()
      this.taskList.push(task)
      this.handler(task)
      n--
    }
  }

  async handler(task: BiliSpaceTaskData) {
    this.logger.verbose('query space: ' + task.uid)
    await request({
      // need_top = 0 包含置顶
      url: `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${task.uid}&need_top=0`,
      method: 'get',
    }).then((res: SpaceApiResponse) => {
      if (res.code === 0 && res.data?.cards?.length > 0) {
        // 取最近的一条
        let dynamicArr = res.data.cards
        /**
         * 筛选出需要通知的:
         * 
         * - 时间戳大于上一次缓存的时间戳
         * - 按时间戳升序排序（新的靠后）
         */
        let newDynamics = dynamicArr
          .filter(i => i.desc.timestamp > task.timestamp)
          .sort((a, b) => a.desc.timestamp - b.desc.timestamp)

        let len = newDynamics.length
        if (len > 0) {
          // 更新缓存
          task.dynamic_id = dynamicArr[len - 1].desc.dynamic_id
          task.dynamic_id_str = dynamicArr[len - 1].desc.dynamic_id_str
          task.timestamp = dynamicArr[len - 1].desc.timestamp
          newDynamics.forEach(async i => {
            await this.sendNotification(i.desc.dynamic_id_str, task)
          })
        }
      }
    }).finally(() => {
      let now = new Date().getTime() / 1000
      if (task.timestamp < now) {
        task.timestamp = now
      }
    })
  }

  /**
   * 发送截图
   * @param did 动态的id
   * @param task 任务项
   */
  async sendNotification(did: string, task: BiliSpaceTaskData) {
    await this.screenShotUtil.getScreenShot(did).then(base64 => {
      task.bot.forEach(bot => {
        bot.group?.forEach(group => {
          this.botService.send_group_msg({ self_id: bot.id }, group.id,
            [{ type: 'image', data: { file: base64 } }])
        })
        bot.user?.forEach(user_id => {
          this.botService.send_private_msg({ self_id: bot.id }, user_id,
            [{ type: 'image', data: { file: base64 } }])
        })
      })
    })
  }

  /**
   * 读取配置文件
   * @returns json object
   */
  getConfig() {
    let confPath = `${path.resolve(__dirname, '..')}${path.sep}config${path.sep}${this.configFileName}`
    this.logger.debug('config path:' + confPath)
    try {
      return JSON.parse(fs.readFileSync(confPath).toString())
    } catch (e) {
      this.logger.error(`get ${this.configFileName} error`)
      this.logger.debug(e)
    }
  }

  /**
   * 更新配置文件
   */
  setConfig() {
    let confPath = `${path.resolve(__dirname, '..')}${path.sep}config${path.sep}${this.configFileName}`
    fs.writeFile(confPath, JSON.stringify(this.taskList), () => this.logger.verbose(`update ${this.configFileName}`))
  }

  /**
   * 查询订阅信息
   * @param msg msg 收到的msg
   * @param uid userId / groupId 需要查询的用户ID或群聊ID
   * @returns info
   */
  info(msg: CommonEventData, uid: number): string {
    let res = `bilibili space task\n`
    let total = this.taskList.filter(i =>
      i.bot.find(b => b.id === msg.self_id && (b.group?.find(i => i.id === uid) || b.user?.includes(uid))))
    res += `total: ${total.length}\n`
    total.forEach(i => {
      res += `- ${i.name}(${i.uid})\n`
    })
    return res
  }

  /**
   * 通过uid查询B站信息
   * @param uid B站uid
   * @returns Promise
   */
  async getUserInfo(uid: number) {
    return await request({
      method: 'get',
      url: 'https://api.bilibili.com/x/space/acc/info?mid=' + uid,
    })
  }

  /**
   * 添加订阅
   * @param msg 群聊或私聊消息
   * @param uid B站UID
   * @returns 结果
   */
  async add(msg: GroupMessageEventData | PrivateMessageEventData, uid: number): Promise<string> {
    const task: BiliSpaceTaskData = this.taskList.find(i => i.uid === uid)
    let name = ''
    // This uid-task exists
    if (task) {
      name = task.name
      const bot = task.bot.find(i => i.id === msg.self_id)
      if (bot) {
        msg.message_type === 'group' ?
          bot.group?.push({ at: true, id: msg.group_id }) :
          bot.user?.push(msg.user_id)
      } else {
        task.bot.push({
          id: msg.self_id,
          group: msg.message_type === 'group' ? [{ at: true, id: msg.group_id }] : [],
          user: msg.message_type === 'private' ? [msg.user_id] : [],
        })
      }
    } else {
      await this.getUserInfo(uid).then(res => {
        if (!res.data) {
          this.logger.debug('No user found: ' + uid)
          return 'No user found: ' + uid
        }
        this.logger.debug('get user info by uid: ' + uid)
        name = res.data.name
        this.taskList.push({
          uid: res.data.mid,
          name: res.data.name,
          timestamp: new Date().getTime() / 1000,
          dynamic_id: undefined,
          dynamic_id_str: undefined,
          bot: [{
            id: msg.self_id,
            group: msg.message_type === 'group' ? [{ at: true, id: msg.group_id }] : [],
            user: msg.message_type === 'private' ? [msg.user_id] : [],
          }]
        })
      })
    }
    this.setConfig()
    return `bst added: ${name}(${uid})`
  }

  /**
   * 取消订阅
   * @param msg msg 群聊或私聊消息
   * @param uid 要取消订阅的uid
   * @returns 结果
   */
  remove(msg: GroupMessageEventData | PrivateMessageEventData, uid: number): string {
    const task: BiliSpaceTaskData = this.taskList.find(i => i.uid === uid)
    let name = ''
    if (task) {
      name = task.name
      const bot = task.bot.find(i => i.id === msg.self_id)
      if (bot) {
        // remove by msg.userId / msg.groupId
        if (msg.message_type === 'group') {
          let index = bot.group?.findIndex(i => i.id === msg.group_id)
          if (index != undefined && index > -1) {
            bot.group?.splice(index, 1)
          }
        } else {
          let index = bot.user?.findIndex(i => i === msg.sender.user_id)
          if (index != undefined && index > -1) {
            bot.user?.splice(index, 1)
          }
        }
        // 取消订阅后 如果当前任务不存在订阅 则删除此任务
        if (!task.bot.find(i => i.group!.length > 0 || i.user!.length > 0)) {
          this.taskList.splice(this.taskList.indexOf(task), 1)
          this.logger.debug('remove empty task: ' + uid)
        }
        this.setConfig()
        return `bst unsubscribed: ${name}(${uid})`
      } else {
        return 'No space subscription found'
      }
    } else {
      return 'No UID found'
    }
  }
}