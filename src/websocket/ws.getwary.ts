import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { MessageService } from "src/service/message.service";
import { MetaEventService } from "src/service/meta-event.service";
import { NoticeService } from "src/service/notice.service";
import { RequestService } from "src/service/request.service";
import * as WebSocket from 'ws';
import * as path from 'path'
import { accessSync, constants, readFileSync } from "fs"
import * as yaml from 'js-yaml'
import { LifecycleMetaEventData, HeartbeatMetaEventData, FriendRequestEventData, GroupRequestEventData, PrivateMessageEventData, GroupMessageEventData, GroupUploadNoticeEventData, GroupAdminNoticeEventData, GroupDecreaseNoticeEventData, GroupIncreaseNoticeEventData, GroupBanNoticeEventData, FriendAddNoticeEventData, GroupRecallNoticeEventData, FriendRecallNoticeEventData, PockNoticeEventData, LuckyKingNoticeEventData, HonorNoticeEventData } from "src";

// 加载配置文件
getConfig()

@WebSocketGateway(global.config.server['ws-port'])
export class WsStartGateway {

  private readonly logger = new Logger(WsStartGateway.name)

  constructor(
    private metaEventService: MetaEventService,
    private requestService: RequestService,
    private messageService: MessageService,
    private noticeService: NoticeService) {
    this.logger.log('The websocket runs on port :>> ' + global.config.server['ws-port'])
  }

  /**
   * 处理生命周期事件
   * @param data 生命周期事件
   */
  @SubscribeMessage('meta_event')
  meatEvent(@MessageBody() data: LifecycleMetaEventData | HeartbeatMetaEventData): any {
    this.metaEventService[data.meta_event_type]?.(data as any)
  }

  /**
   * 处理请求事件
   * @param data 请求事件
   */
  @SubscribeMessage('request')
  request(@MessageBody() data: FriendRequestEventData | GroupRequestEventData): any {
    this.requestService[data.request_type]?.(data as any)
  }

  /**
   * 处理消息事件
   * @param data 消息事件
   */
  @SubscribeMessage('message')
  message(@MessageBody() data: PrivateMessageEventData | GroupMessageEventData): any {
    this.messageService[data.message_type]?.(data as any)
  }

  /**
   * 处理通知事件
   * @param data 通知事件
   */
  @SubscribeMessage('notice')
  notice(@MessageBody() data: GroupUploadNoticeEventData | GroupAdminNoticeEventData |
    GroupDecreaseNoticeEventData | GroupIncreaseNoticeEventData | GroupBanNoticeEventData |
    FriendAddNoticeEventData | GroupRecallNoticeEventData | FriendRecallNoticeEventData |
    PockNoticeEventData | LuckyKingNoticeEventData | HonorNoticeEventData): any {
    this.noticeService[data.notice_type]?.(data as any)
  }

}

function getConfig() {
  let confPath = `${path.resolve(__dirname, '..', '..')}${path.sep}config.yml`
  new Logger('config').debug('config path:', confPath)
  try {
    accessSync(confPath, constants.R_OK | constants.W_OK)
    global.config = yaml.load(readFileSync(confPath, 'utf8')) as any
  } catch (e) {
    console.error('get config err:', e)
    process.exit(1)
  }
}