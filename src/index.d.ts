/**
 * 发送API的类型
 */
export type ApiType =
  'send_private_msg' | 'send_group_msg' | 'send_msg' | 'delete_msg' | 'get_msg' |
  'get_forward_msg' | 'send_like' | 'set_group_kick' | 'set_group_ban' |
  'set_group_anonymous_ban' | 'set_group_whole_ban' | 'set_group_admin' |
  'set_group_anonymous' | 'set_group_card' | 'set_group_name' | 'set_group_leave' |
  'set_group_special_title' | 'set_friend_add_request' | 'set_group_add_request' |
  'get_login_info' | 'get_stranger_info' | 'get_friend_list' | 'get_group_info' |
  'get_group_list' | 'get_group_member_info' | 'get_group_member_list' | 'get_group_honor_info' |
  'get_cookies' | 'get_csrf_token' | 'get_credentials' | 'get_record' |
  'get_image' | 'can_send_image' | 'can_send_record' | 'get_status' |
  'get_version_info' | 'set_restart' | 'clean_cache'

/** 注册机器人信息 */
export interface Bot {
  /** 接口地址 */
  url: string
  id: number
  token?: string
  online?: boolean
  /** 上次lifecycle后心跳次数 */
  beats?: number
  /** 上次lifecycle */
  last_lifecycle: number
  /** 上次心跳 */
  last_beat: number
}


export interface ModuleClass {
  validator: (msg: any) => boolean
  processor: (msg: any) => void
}

export interface MessageModule extends ModuleClass {
  /** 处理的消息类型，缺省时为通用模块 */
  type?: MessageType | MessageType[]
}

export interface MeatEventModule extends ModuleClass {
  type?: MeatEventType | MeatEventType[]
}

export interface RequestModule extends ModuleClass {
  type?: RequestType | RequestType[]
}

export interface NoticeModule extends ModuleClass {
  type?: NoticeType | NoticeType[]
}

export type PostType = "meta_event" | "request" | "message" | "notice"
export type MessageType = 'private' | 'group'
export type MeatEventType = "lifecycle" | "heartbeat"
export type RequestType = "friend" | "group"
export type NoticeType = "group_upload" | "group_admin" | "group_decrease" | "group_increase" | "group_ban" |
  "friend_add" | "group_recall" | "friend_recall" | "notify"

/** 公共事件对象 */
export interface CommonEventData {
  /** 收到事件的机器人 QQ 号 */
  self_id: number,
  /** 事件发生的时间戳 */
  time: number,
  /** 上报类型 */
  post_type: PostType,
  /** 元事件 */
  meta_event_type?: MeatEventType,
  /** 请求事件 */
  request_type?: RequestType,
  /** 消息事件 */
  message_type?: MessageType,
  /** 通知事件 */
  notice_type?: NoticeType,
  /** 消息子类型 */
  sub_type?: string,
}



/**
 * #### message events
 * @extends CommonEventData
 * 
 * 消息事件:
 * 
 * |event|interface|
 * |--|--|
 * |私聊消息|PrivateMessageEventData|
 * |群聊消息|GroupMessageEventData|
 */
interface CommonMessageEventData extends CommonEventData {
  post_type: "message",
  /** 消息链 */
  message: Message[] | string,
  /** 字符串格式的原始消息内容 */
  raw_message: string,
  /** 消息 ID */
  message_id: number,
  /** 发送者 QQ 号 */
  user_id: number,
  /** 字体 */
  font: string,
}
/** 私聊消息event data */
export interface PrivateMessageEventData extends CommonMessageEventData {
  /** 私聊消息 */
  message_type: "private",
  /** 消息子类型，如果是好友则是 friend，如果是群临时会话则是 group */
  sub_type: "friend" | "group" | "other",
  /** 发送人信息 */
  sender: Sender,
}
/** 群消息event data */
export interface GroupMessageEventData extends CommonMessageEventData {
  /** 群消息 */
  message_type: "group",
  /** 消息子类型，正常消息是 normal，匿名消息是 anonymous，系统提示（如「管理员已禁止群内匿名聊天」）是 notice */
  sub_type: "normal" | "anonymous" | "notice",
  /** 群号 */
  group_id: number,
  /** 匿名信息，如果不是匿名消息则为 null */
  anonymous: Anonymous | null,
  /** 发送人信息 */
  sender: Sender,
}
/** 匿名信息 */
export interface Anonymous {
  /** 匿名用户 ID */
  id: number,
  /** 匿名用户名称 */
  name: string,
  /** 匿名用户 flag，在调用禁言 API 时需要传入 */
  flag: string,
}
/**
 * @description 发送者信息
 * ---
 * 需要注意的是，sender 中的各字段是尽最大努力提供的，也就是说，不保证每个字段都一定存在，也不保证存在的字段都是完全正确的（缓存可能过期）。
 * 尤其对于匿名消息，此字段不具有参考价值。
 */
export interface Sender {
  /** 发送者 QQ 号 */
  user_id?: number
  /** 昵称 */
  nickname?: number
  /** 群名片／备注 */
  card?: string
  /** 性别，male 或 female 或 unknown */
  sex?: 'male' | 'famle' | 'unknown'
  /** 年末领 */
  age?: number
  /** 地区 */
  area?: string
  /** 成员等级 */
  level?: string
  /** 角色 */
  role?: 'owner' | 'admin' | 'member'
  /** 专属头像 */
  title?: string
}



/** 
 * @description notice events
 * @extends CommonEventData
 * 
 * #### 通知事件:
 * 
 * |event|interface|
 * |--|--|
 * |群文件上传|GroupIncreaseNoticeEventData|
 * |群管理员变动|GroupUploadNoticeEventData|
 * |群成员减少|GroupAdminNoticeEventData|
 * |群成员增加|GroupDecreaseNoticeEventData|
 * |群禁言|GroupBanNoticeEventData|
 * |好友添加|FriendAddNoticeEventData|
 * |群消息撤回|GroupRecallNoticeEventData|
 * |好友消息撤回|FriendRecallNoticeEventData|
 * |群内戳一戳|PockNoticeEventData|
 * |群红包运气王|LuckyKingNoticeEventData|
 * |群成员荣誉变更|HonorNoticeEventData|
 */
interface CommonNoticeEventData extends CommonEventData {
  post_type: "notice"
}
/** 群文件上传 */
export interface GroupUploadNoticeEventData extends CommonNoticeEventData {
  notice_type: 'group_upload'
  group_id: number
  /** 发送者 QQ 号 */
  user_id: number
  file: GroupFile
}
/** 群文件信息 */
export interface GroupFile {
  /** 文件 ID */
  id: string
  /** 文件名 */
  name: string
  /** 文件大小（字节数） */
  size: number
  /** busid（目前不清楚有什么作用） */
  busid: number
}
/** 群管理员变动 */
export interface GroupAdminNoticeEventData extends CommonNoticeEventData {
  notice_type: 'group_admin'
  /** 事件子类型，分别表示设置和取消管理员 */
  sub_type: 'set' | 'unset'
  group_id: number
  user_id: number
}
/** 群成员减少 */
export interface GroupDecreaseNoticeEventData extends CommonNoticeEventData {
  notice_type: 'group_decrease'
  /** 事件子类型，分别表示主动退群、成员被踢、登录号被踢 */
  sub_type: 'leave' | 'kick' | 'kick_me'
  group_id: number
  /** 操作者 QQ 号（如果是主动退群，则和 user_id 相同） */
  operator_id: number
  /** 离开者 QQ 号 */
  user_id: number
}
/** 群成员增加 */
export interface GroupIncreaseNoticeEventData extends CommonNoticeEventData {
  notice_type: "group_increase"
  /** 事件子类型，分别表示管理员已同意入群、管理员邀请入群 */
  sub_type: "approve" | "invite"
  group_id: number
  /** 操作者 QQ 号 */
  operator_id: number
  /** 加入者 QQ 号 */
  user_id: number
}
/** 群禁言 */
export interface GroupBanNoticeEventData extends CommonNoticeEventData {
  notice_type: 'group_ban'
  /** 事件子类型，分别表示禁言、解除禁言 */
  sub_type: 'ban' | 'lift_ban'
  group_id: number
  /** 操作者 QQ 号 */
  operator_id: number
  /** 被禁言 QQ 号 */
  user_id: number
  /** 禁言时长，单位秒 */
  duration: number
}
/** 好友添加 */
export interface FriendAddNoticeEventData extends CommonNoticeEventData {
  notice_type: 'friend_add'
  /** 新添加好友 QQ 号 */
  user_id: number
}
/** 群消息撤回 */
export interface GroupRecallNoticeEventData extends CommonNoticeEventData {
  notice_type: 'group_recall'
  group_id: number
  /** 消息发送者 QQ 号 */
  user_id: number
  /** 操作者 QQ 号 */
  operator_id: number
  /** 被撤回的消息 ID */
  messagr_id: number
}
/** 好友消息撤回 */
export interface FriendRecallNoticeEventData extends CommonNoticeEventData {
  notice_type: 'friend_recall'
  /** 好友 QQ 号 */
  user_id: number
  /** 被撤回的消息 ID */
  message_id: number
}
/** 群内戳一戳 */
export interface PockNoticeEventData extends CommonNoticeEventData {
  notice_type: 'notify'
  sub_type: 'poke'
  group_id: number
  /** 发送者 QQ 号 */
  user_id: number
  /** 被戳者 QQ 号 */
  target_id: number
}
/** 群红包运气王 */
export interface LuckyKingNoticeEventData extends CommonNoticeEventData {
  notice_type: 'notify'
  sub_type: 'lucky_king'
  group_id: number
  /** 红包发送者 QQ 号 */
  user_id: number
  /** 运气王 QQ 号 */
  target_id: number
}
/** 群成员荣誉变更 */
export interface HonorNoticeEventData extends CommonNoticeEventData {
  notice_type: 'notify'
  sub_type: 'honor'
  group_id: number
  /** 荣誉类型，分别表示龙王、群聊之火、快乐源泉 */
  honor_type: 'talkative' | 'performer' | 'emotion'
  /** 成员 QQ 号 */
  user_id: number
}


/**
 * @description 
 * @extends CommonEventData
 * #### request event 请求事件：
 * 
 * |event|interface|
 * |--|--|
 * |加好友请求|FriendRequestEventData|
 * |加群请求／邀请|GroupRequestEventData|
 */
interface CommonRequestEventData extends CommonEventData {
  post_type: "request"
  /** 发送请求的 QQ 号 */
  user_id: number
  /** 验证信息 */
  comment: string
  /** 请求 flag，在调用处理请求的 API 时需要传入 */
  flag: string
}
/** 加好友请求 */
export interface FriendRequestEventData extends CommonRequestEventData {
  request_type: 'friend'
}
/** 加群请求／邀请 */
export interface GroupRequestEventData extends CommonRequestEventData {
  request_type: 'group'
  /** 请求子类型，分别表示加群请求、邀请登录号入群 */
  sub_type: 'add' | 'invite'
  group_id: number
}


/**
 * @description
 * @extends CommonEventData
 * #### meta event 元事件
 * 
 * |event|interface|
 * |--|--|
 * |生命周期|LifecycleMetaEventData|
 * |心跳|HeartbeatMetaEventData|
 */
interface CommonMetaEventData extends CommonEventData {
  post_type: 'meta_event'
}
/** 
 * #### 生命周期
 * 注意，目前生命周期元事件中，只有 HTTP POST 的情况下可以收到 enable 和 disable，只有正向 WebSocket 和反向 WebSocket 可以收到 connect。
 */
export interface LifecycleMetaEventData extends CommonMetaEventData {
  meta_event_type: 'lifecycle'
  /** 事件子类型，分别表示 OneBot 启用、停用、WebSocket 连接成功 */
  sub_type: 'enable' | 'disable' | 'connect'
}
/** 心跳 */
export interface HeartbeatMetaEventData extends CommonMetaEventData {
  meta_event_type: 'heartbeat'
  /** 
   * 状态信息,
   * status 字段的内容和 get_status 接口的快速操作相同
   */
  status: object
  /** 到下次心跳的间隔，单位毫秒 */
  interval: number
}


/**
 * 消息是 OneBot 标准中一个重要的数据类型，在发送消息的 API 和接收消息的事件中都有相关字段。
 * 
 * 目前消息的格式分为两种：字符串（string）和数组（array）。
 * 
 * [参考 OneBot v11 中的定义](https://github.com/botuniverse/onebot/blob/master/v11/specs/message/segment.md)
 */
export interface Message {
  /** 其中 type 字段的类型为字符串，对应 CQ 码中的「功能名」 */
  type: 'text' | 'face' | 'image' | 'record' | 'video' | 'at' | 'rps' | 'dice' | 'shake' | 'poke' | 'anonymous' |
  'share' | 'contact' | 'location' | 'music' | 'reply' | 'forward' | 'node' | 'xml' | 'json'
  /** data 字段的类型为对象，对应 CQ 码的「参数」，此字段可为 null */
  data: {
    [key: string]: string | { [key: string]: string | { [key: string]: string } }
  } | null
}
/** 纯文本 */
export interface ArrayMessageText extends Message {
  type: 'text'
  data: { text: string }
}
/** QQ 表情 */
export interface ArrayMessageFace extends Message {
  type: 'face'
  data: { id: string }
}
/** 图片 */
export interface ArrayMessageImage extends Message {
  type: 'image'
  data: {
    file: string
    type: string
    url?: string
    cache?: string
    proxy?: string
    timeout?: string
  }
}
/** 语音 */
export interface ArrayMessageRecord extends Message {
  type: 'record'
  data: {
    file: string
    url?: string
    cache?: string
    proxy?: string
    timeout?: string
  }
}
/** 短视频 */
export interface ArrayMessageVideo extends Message {
  type: 'video'
  data: {
    file: string
    url?: string
    cache?: string
    proxy?: string
    timeout?: string
  }
}
/** @ 某人 */
export interface ArrayMessageAt extends Message {
  type: 'at'
  data: { qq: string | 'all' }
}
/** 猜拳魔法表情 */
export interface ArrayMessageRps extends Message {
  type: 'rps'
  data: {}
}
/** 掷骰子魔法表情 */
export interface ArrayMessageDice extends Message {
  type: 'dice'
  data: {}
}
/** 窗口抖动（戳一戳） */
export interface ArrayMessageShake extends Message {
  type: 'shake'
  data: {}
}
/** 戳一戳 */
export interface ArrayMessagePoke extends Message {
  type: 'poke'
  data: {
    type: string
    id: string
    name: string
  }
}
/** 匿名发消息 */
export interface ArrayMessageAnonymous extends Message {
  type: 'anonymous'
  data: {}
}
/** 链接分享 */
export interface ArrayMessageShare extends Message {
  type: 'share'
  data: {
    url: string
    title: string
    content: string
    image: string
  }
}
/** 推荐好友 / 推荐群 */
export interface ArrayMessageContact extends Message {
  type: 'contact'
  data: {
    type: 'qq' | 'group'
    id: string
  }
}
/** 位置 */
export interface ArrayMessageLocation extends Message {
  type: 'location'
  data: {
    lat: string
    lon: string
    title: string
    content: string
  }
}
/** 音乐分享 */
export interface ArrayMessageMusic extends Message {
  type: 'music'
  data: {
    type: string
    id: string
  }
}
/** 音乐自定义分享 */
export interface ArrayMessageMusicCust extends Message {
  type: 'music'
  data: {
    type: string
    url: string
    audio: string
    title: string
    content?: string
    image?: string
  }
}
/** 回复 */
export interface ArrayMessageReply extends Message {
  type: 'reply'
  data: { id: string }
}
/** 合并转发 */
export interface ArrayMessageForward extends Message {
  type: 'forward'
  data: { id: string }
}
/** 合并转发节点 */
export interface ArrayMessageNode extends Message {
  type: 'node'
  data: { id: string }
}
/** 
 * 合并转发自定义节点
 * 
 * > 注意
 * 
 * > 接收时，此消息段不会直接出现在消息事件的 message 中，需通过 get_forward_msg API 获取。
 */
export interface ArrayMessageNodeCust extends Message {
  type: 'node'
  data: {
    user_id: string
    nickname: string
    content: string | ArrayMessage
  }
}
/** XML 消息 */
export interface ArrayMessageXml extends Message {
  type: 'xml'
  data: { 'data': string }
}
/** JSON 消息 */
export interface ArrayMessageJson extends Message {
  type: 'json'
  data: { 'data': string }
}

export type OpenApiRes<T> = {
  data: T[],
  retcode: number,
  status: string
}

export type GroupListRes = {
  group_create_time: number,
  group_id: number,
  group_level: number,
  group_memo: string,
  group_name: string,
  max_member_count: number,
  member_count: number,
  admins?: any[],
  owner?: {}
}

export type FriendListRes = {
  nickname: string,
  remark: string,
  user_id: number
}

export type GroupMemberListRes = {
  age: number,
  area: string,
  card: string,
  card_changeable: boolean,
  group_id: number,
  join_time: number,
  last_sent_time: number,
  level: string,
  nickname: string,
  role: 'owner' | 'member' | 'admin',
  sex: string,
  shut_up_timestamp: number,
  title: string,
  title_expire_time: number,
  unfriendly: boolean,
  user_id: number
}

/**
 * 2层指令集
 * 
 * cmd type -options [args]
 */
export type InstructionSet = {
  [key: string]: string | {
    [key: string]: string
  }
}