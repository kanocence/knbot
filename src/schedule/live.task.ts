import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { CommonEventData, GroupMessageEventData, PrivateMessageEventData } from 'src';
import { BotService } from 'src/service/bot.service';
import { request } from 'src/utils/request';
import { BiliLiveTaskData } from './task';
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class BiliLiveTask {

  private readonly logger = new Logger(BiliLiveTask.name)

  private configFileName = 'bilibili-live-task-config.json'

  // 定时任务使用的数据
  private taskList: BiliLiveTaskData[] = []

  constructor(private readonly botService: BotService) {
    this.logger.log('create bilibili live task')
    // 读取配置文件
    let config = this.getConfig()
    if (config) {
      this.taskList = config
    }
  }

  /**
   * 定时任务 每分钟的 0 15 30 45 执行
   * @returns 
   */
  @Cron('*/15 * * * * *')
  async handleCron() {
    // all uids
    const uids = this.taskList.map(i => i.uid)
    if (uids.length === 0) {
      return
    }

    // 批量查询直播间(文档: https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/live/info.md)
    await request({
      url: 'https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids',
      method: 'post',
      data: { uids: uids }
    }).then(res => {
      this.logger.verbose(`request get_status_info_by_uids, total: ${uids.length} ${JSON.stringify(uids)}`)
      if (res.code != 0) {
        this.logger.error('get_status_info_by_uids error' + res.message)
        return
      }
      this.taskList.forEach(item => {
        let data = res.data[item.uid]
        if (data?.live_status === 1 && !item.flag) {
          item.flag = true
          item.name = data.uname
          // 记录flag
          this.setConfig()
          // 通知所有bot
          item.bot.forEach(i => {
            // 通知所有订阅的群
            i.group?.forEach(async g => {
              this.botService.send_group_msg({ self_id: i.id }, g.id,
                [
                  g.at ? {
                    type: "at",
                    data: { qq: "all" }
                  } : { type: "text", data: { text: '' } },
                  {
                    type: "text",
                    data: { text: `\n${item.name}正在直播:\n${data.title}` }
                  },
                  {
                    type: "image",
                    data: { file: data.keyframe }
                  },
                  {
                    type: "text",
                    data: { text: `https://live.bilibili.com/${data.room_id}` }
                  }
                ])
            })
            // 通知所有订阅的用户
            i.user?.forEach(async userId => {
              await this.botService.send_private_msg({ self_id: i.id }, userId,
                [
                  {
                    type: "text",
                    data: { text: `\n${item.name}正在直播:\n${data.title}` }
                  },
                  {
                    type: "image",
                    data: { file: data.keyframe }
                  },
                  {
                    type: "text",
                    data: { text: `https://live.bilibili.com/${data.room_id}` }
                  }
                ])
            })
          })
        } else {
          item.flag = data?.live_status === 1 ? true : false
        }
      })
    })
  }

  /**
   * 添加订阅
   * @param msg 群聊或私聊消息
   * @param uid B站UID
   * @returns 结果
   */
  async add(msg: GroupMessageEventData | PrivateMessageEventData, uid: number): Promise<string> {
    const task: BiliLiveTaskData = this.taskList.find(i => i.uid === uid)
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
          flag: false,
          bot: [{
            id: msg.self_id,
            group: msg.message_type === 'group' ? [{ at: true, id: msg.group_id }] : [],
            user: msg.message_type === 'private' ? [msg.user_id] : [],
          }]
        })
      })
    }
    this.setConfig()
    return `blt added: ${name}(${uid})`
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
   * 取消订阅
   * @param msg msg 群聊或私聊消息
   * @param uid 要取消订阅的uid
   * @returns 结果
   */
  remove(msg: GroupMessageEventData | PrivateMessageEventData, uid: number): string {
    const task: BiliLiveTaskData = this.taskList.find(i => i.uid === uid)
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
        return `blt unsubscribed: ${name}(${uid})`
      } else {
        return 'No live subscription found'
      }
    } else {
      return 'No UID found'
    }
  }

  /**
   * 查询订阅信息
   * @param msg msg 收到的msg
   * @param uid userId / groupId 需要查询的用户ID或群聊ID
   * @returns info
   */
  info(msg: CommonEventData, uid: number): string {
    let res = `bilibili live task\n`
    let total = this.taskList.filter(i =>
      i.bot.find(b => b.id === msg.self_id && (b.group?.find(i => i.id === uid) || b.user?.includes(uid))))
    res += `total: ${total.length}\n`
    total.forEach(i => {
      res += `- ${i.name}(${i.uid})\n`
    })
    return res
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
    fs.writeFile(confPath, JSON.stringify(this.taskList), () => this.logger.debug(`update ${this.configFileName}`))
  }

}