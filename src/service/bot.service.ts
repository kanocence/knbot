import { Injectable, Logger } from '@nestjs/common'
import { request } from 'src/utils/request';
import { AxiosResponse } from "axios"
import { Anonymous, ApiType, Bot, CommonEventData, FriendListRes, GroupListRes, GroupMemberListRes, Message, OpenApiRes } from 'src';

@Injectable()
export class BotService {

  private readonly logger = new Logger(BotService.name)

  /**
   * 获取bot信息
   * @param id bit_id
   * @returns bot || undefined
   */
  getBot(id: number) {
    const { bots } = global.config
    const bot = bots.find((i: Bot) => i.id = id)
    !bot && this.logger.warn(`bot(${id}) was not registered`)
    bot.accessToken = bot.token ? '?access_token=' + bot.token : '?'
    return bot
  }

  /**
   * 通用接口，根据配置文件中地址给bot发送信息
   * @param type 发送的api类型
   * @param data api使用的参数
   * @param msg 消息原文对象
   */
  async send(type: ApiType, data: any, msg: CommonEventData | { self_id: number }): Promise<AxiosResponse<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    // this.logger.debug('request data :>> ', data)
    // return
    return await request({
      method: 'post',
      url: `${bot.url}/${type}${bot.accessToken}`,
      data: data
    }).then(res => {
      this.logger.debug('call bot success ' + msg.self_id)
      if (res.status != 'ok') {
        this.logger.error(res)
      }
      return res
    }).catch(err => {
      this.logger.error('call bot reject ' + msg.self_id)
      return Promise.reject(err)
    })
  }

  /**
   * 获取好友列表
   * @param msg 
   * @returns 
   */
  async get_friend_list(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<FriendListRes>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_friend_list${bot.accessToken}`
    })
  }

  /**
   * 获取群列表
   * @param msg 
   * @returns 
   */
  async get_group_list(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<GroupListRes>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_group_list${bot.accessToken}`
    })
  }

  /**
   * 获取群信息
   * @param msg 
   * @param groupId 群号
   * @returns 
   */
  async get_group_info(msg: CommonEventData | { self_id: number }, groupId: number | string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_group_info${bot.accessToken}&group_id=${groupId}`
    })
  }

  /**
   * 获取群成员列表
   * @param msg 
   * @param groupId 群号
   * @returns 
   */
  async get_group_member_list(msg: CommonEventData | { self_id: number }, groupId: number | string): Promise<OpenApiRes<GroupMemberListRes>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_group_member_list${bot.accessToken}&group_id=${groupId}`
    })
  }

  /**
   * 获取群荣誉信息
   * @param msg 
   * @param groupId 群号
   * @param type 要获取的群荣誉类型，可传入 talkative performer legend strong_newbie emotion 以分别获取单个类型的群荣誉数据，或传入 all 获取所有数据
   * @returns 
   */
  async get_group_honor_info(msg: CommonEventData | { self_id: number },
    groupId: number | string,
    type: 'talkative' | 'performer' | 'legend' | 'strong_newbie' | 'emotion'): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_group_honor_info${bot.accessToken}&group_id=${groupId}&type=${type}`
    })
  }

  /**
   * 获取群成员信息
   * @param msg 
   * @param groupId 群号
   * @param userId QQ 号
   * @returns 
   */
  async get_group_member_info(msg: CommonEventData | { self_id: number },
    groupId: number | string, userId: number | string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_group_member_info${bot.accessToken}&group_id=${groupId}&user_id=${userId}`
    })
  }

  /**
   * 获取陌生人信息
   * @param msg 
   * @param userId QQ 号
   * @returns 
   */
  async get_stranger_info(msg: CommonEventData | { self_id: number }, userId: number | string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_stranger_info${bot.accessToken}&user_id=${userId}`
    })
  }

  /**
   * 获取登录号信息
   * @param msg 
   * @returns 
   */
  async get_login_info(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_login_info${bot.accessToken}`
    })
  }

  /**
   * 获取消息
   * @param msg 
   * @param messageId 消息 ID
   * @returns 
   */
  async get_msg(msg: CommonEventData | { self_id: number }, messageId: number | string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_msg${bot.accessToken}&message_id=${messageId}`
    })
  }

  /**
   * 获取合并转发消息
   * @param msg 
   * @param id 合并转发 ID
   * @returns 
   */
  async get_forward_msg(msg: CommonEventData | { self_id: number }, id: number | string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_forward_msg${bot.accessToken}&id=${id}`
    })
  }

  /**
   * 发送好友赞
   * @param msg 
   * @param userId 对方 QQ 号
   * @returns 
   */
  async send_like(msg: CommonEventData | { self_id: number }, userId: number | string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/send_like${bot.accessToken}&user_id=${userId}`
    })
  }

  /**
   * 群组踢人
   * @param msg 
   * @param groupId 群号
   * @param userId 要踢的 QQ 号
   * @param reject 拒绝此人的加群请求
   * @returns 
   */
  async set_group_kick(msg: CommonEventData | { self_id: number },
    groupId: number | string, userId: number | string, reject: boolean): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_group_kick${bot.accessToken}&group_id=${groupId}&user_id=${userId}&reject_add_request=${reject}`
    })
  }

  /**
   * 撤回消息
   * @param msg 
   * @param id 消息 ID
   * @returns 
   */
  async delete_msg(msg: CommonEventData | { self_id: number }, id: number | string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/delete_msg${bot.accessToken}&id=${id}`
    })
  }

  /**
   * 清理缓存
   * @param msg 
   * @returns 
   */
  async clean_cache(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/clean_cache${bot.accessToken}`
    })
  }

  /**
   * 获取运行状态
   * @param msg 
   * @returns 
   */
  async get_status(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_status${bot.accessToken}`
    })
  }

  /**
   * 获取版本信息
   * @param msg 
   * @returns 
   */
  async get_version_info(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_version_info${bot.accessToken}`
    })
  }

  /**
   * 检查是否可以发送语音
   * @param msg 
   * @returns 
   */
  async can_send_record(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/can_send_record${bot.accessToken}`
    })
  }

  /**
   * 检查是否可以发送图片
   * @param msg 
   * @returns 
   */
  async can_send_image(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/can_send_image${bot.accessToken}`
    })
  }

  /**
   * 获取图片
   * @param msg 
   * @param file 收到的图片文件名（消息段的 file 参数），如 asd.jpg
   * @returns 
   */
  async get_image(msg: CommonEventData | { self_id: number }, file: string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_image${bot.accessToken}&file=${file}`
    })
  }

  /**
   * 获取语音
   * @param msg 
   * @param file 收到的语音文件名（消息段的 file 参数），如 asd.silk
   * @param format 要转换到的格式，目前支持 mp3、amr、wma、m4a、spx、ogg、wav、flac
   * @returns 
   */
  async get_record(msg: CommonEventData | { self_id: number }, file: string,
    format: 'mp3' | 'amr' | 'wma' | 'm4a' | 'spx' | 'ogg' | 'wav' | 'flac'): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_record${bot.accessToken}&file=${file}&out_format=${format}`
    })
  }

  /**
   * 获取 QQ 相关接口凭证
   * @param msg 
   * @returns 
   */
  async get_credentials(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_credentials${bot.accessToken}`
    })
  }

  /**
   * 获取 CSRF Token
   * @param msg 
   * @returns 
   */
  async get_csrf_token(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/get_csrf_token${bot.accessToken}`
    })
  }

  /**
   * 重启
   * @param msg 
   * @returns 
   */
  async set_restart(msg: CommonEventData | { self_id: number }): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_restart${bot.accessToken}`
    })
  }

  /**
   * 发送私聊消息
   * @param msg 
   * @param userId 对方 QQ 号
   * @param message 要发送的内容
   * @returns 
   */
  async send_private_msg(msg: CommonEventData | { self_id: number },
    userId: number | string, message: Message[] | string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'post',
      url: `${bot.url}/set_restart${bot.accessToken}`,
      data: {
        user_id: userId,
        message
      }
    })
  }

  /**
   * 发送群消息
   * @param msg 
   * @param groupId 群号
   * @param message 要发送的内容
   */
  async send_group_msg(msg: CommonEventData | { self_id: number },
    groupId: number | string, message: Message[] | string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'post',
      url: `${bot.url}/set_restart${bot.accessToken}`,
      data: {
        group_id: groupId,
        message
      }
    })
  }

  /**
   * 发送消息
   * @param msg 
   * @param message 要发送的内容
   * @param message_type 消息类型，支持 private、group，分别对应私聊、群组，如不传入，则根据传入的 *_id 参数判断
   * @param groupId 群号（消息类型为 group 时需要）
   * @param userId 对方 QQ 号（消息类型为 private 时需要）
   */
  async send_msg(msg: CommonEventData | { self_id: number },
    message: Message[] | string, message_type: 'private' | 'group',
    groupId?: number | string, userId?: number | string) {
    if (groupId) {
      this.send_group_msg(msg, groupId, message)
    } else if (userId) {
      this.send_group_msg(msg, groupId, message)
    }
  }

  /**
   * 群组单人禁言
   * @param msg 
   * @param groupId 群号
   * @param userId 要禁言的 QQ 号
   * @param duration 禁言时长，单位秒，0 表示取消禁言
   */
  async set_group_ban(msg: CommonEventData | { self_id: number },
    groupId: number | string, userId: number | string, duration: number): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_group_ban${bot.accessToken}&group_id=${groupId}&user_id=${userId}&duration=${duration}`
    })
  }

  /**
   * 群组匿名用户禁言
   * @param msg 
   * @param duration 禁言时长，单位秒，无法取消匿名用户禁言
   * @param groupId 群号
   * @param anonymous 可选，要禁言的匿名用户对象（群消息上报的 anonymous 字段）
   * @param anonymous_flag 可选，要禁言的匿名用户的 flag（需从群消息上报的数据中获得）
   * @param flag 可选，要禁言的匿名用户的 flag（需从群消息上报的数据中获得）
   * @returns 
   */
  async set_group_anonymous_ban(msg: CommonEventData | { self_id: number }, duration: number,
    groupId: number | string, anonymous: Anonymous, anonymous_flag?: string, flag?: string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'post',
      url: `${bot.url}/set_group_anonymous_ban${bot.accessToken}`,
      data: {
        group_id: groupId,
        anonymous,
        anonymous_flag: anonymous_flag,
        flag: flag,
        duration
      }
    })
  }

  /**
   * 群组全员禁言
   * @param msg 群号
   * @param groupId 是否禁言
   */
  async set_group_whole_ban(msg: CommonEventData | { self_id: number }, groupId: string | number): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_group_whole_ban${bot.accessToken}&group_id=${groupId}`,
    })
  }

  /**
   * 群组设置管理员
   * @param msg 
   * @param groupId 群号
   * @param userId 要设置管理员的 QQ 号
   * @param enable true 为设置，false 为取消
   */
  async set_group_admin(msg: CommonEventData | { self_id: number }, groupId: string | number,
    userId: string | number, enable: boolean): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_group_admin${bot.accessToken}&group_id=${groupId}&user_id=${userId}&enable=${enable}`,
    })
  }

  /**
   * 群组匿名
   * @param msg 
   * @param groupId 群号
   * @param enable 是否允许匿名聊天
   */
  async set_group_anonymous(msg: CommonEventData | { self_id: number }, groupId: string | number,
    enable: boolean): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_group_anonymous${bot.accessToken}&group_id=${groupId}&enable=${enable}`,
    })
  }

  /**
   * 设置群名片（群备注）
   * @param msg 
   * @param groupId 群号
   * @param userId 	要设置的 QQ 号
   * @param card 群名片内容，不填或空字符串表示删除群名片
   */
  async set_group_card(msg: CommonEventData | { self_id: number }, groupId: string | number,
    userId: string | number, card: string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_group_card${bot.accessToken}&group_id=${groupId}&user_id=${userId}&card=${card}`,
    })
  }

  /**
   * 设置群名
   * @param msg 
   * @param groupId 群号
   * @param groupName 新群名
   * @returns 
   */
  async set_group_name(msg: CommonEventData | { self_id: number }, groupId: string | number,
    groupName: string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_group_name${bot.accessToken}&group_id=${groupId}&group_name=${groupName}`,
    })
  }

  /**
   * 退出群组
   * @param msg 
   * @param groupId 群号
   * @param is_dismiss 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
   * @returns 
   */
  async set_group_leave(msg: CommonEventData | { self_id: number }, groupId: string | number,
    is_dismiss: string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_group_leave${bot.accessToken}&group_id=${groupId}&is_dismiss=${is_dismiss}`,
    })
  }

  /**
   * 设置群组专属头衔
   * @param msg 
   * @param groupId 群号
   * @param userId 	要设置的 QQ 号
   * @param specialTitle 专属头衔，不填或空字符串表示删除专属头衔
   * @param duration 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果，可能是只有某些特殊的时间长度有效，有待测试
   * @returns 
   */
  async set_group_special_title(msg: CommonEventData | { self_id: number }, groupId: string | number,
    userId: string | number, specialTitle: string | number, duration: number): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_group_special_title${bot.accessToken}&group_id=${groupId}&user_id=${userId}&special_title=${specialTitle}&duration=${duration}`,
    })
  }

  /**
   * 处理加好友请求
   * @param msg 
   * @param flag 加好友请求的 flag（需从上报的数据中获得）
   * @param approve 是否同意请求
   * @param remark 添加后的好友备注（仅在同意时有效）
   * @returns 
   */
  async set_friend_add_request(msg: CommonEventData | { self_id: number }, flag: string,
    approve: boolean, remark: string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_friend_add_request${bot.accessToken}&flag=${flag}&approve=${approve}&remark=${remark}`,
    })
  }

  /**
   * 处理加好友请求
   * @param msg 
   * @param flag 加好友请求的 flag（需从上报的数据中获得
   * @param approve 是否同意请求
   * @param remark 	添加后的好友备注（仅在同意时有效）
   * @returns 
   */
  async set_group_add_request(msg: CommonEventData | { self_id: number }, flag: string,
    approve: boolean, remark: string): Promise<OpenApiRes<any>> {
    const bot = this.getBot(msg.self_id)
    if (!bot) {
      return Promise.reject()
    }
    return await request({
      method: 'get',
      url: `${bot.url}/set_group_add_request${bot.accessToken}&flag=${flag}&approve=${approve}&remark=${remark}`,
    })
  }
}
