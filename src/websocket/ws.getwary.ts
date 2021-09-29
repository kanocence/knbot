import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import * as WebSocket from 'ws';
import { PrivateMessageEventData, GroupMessageEventData, FriendAddNoticeEventData, FriendRecallNoticeEventData, GroupAdminNoticeEventData, GroupBanNoticeEventData, GroupDecreaseNoticeEventData, GroupIncreaseNoticeEventData, GroupRecallNoticeEventData, GroupUploadNoticeEventData, HonorNoticeEventData, LuckyKingNoticeEventData, PockNoticeEventData, FriendRequestEventData, GroupRequestEventData, HeartbeatMetaEventData, LifecycleMetaEventData } from "./ws";

@WebSocketGateway(16700)
export class WsStartGateway {

  /**
   * 处理生命周期事件
   * @param data 生命周期事件
   */
  @SubscribeMessage('meta_event')
  meatEvent(@MessageBody() data: LifecycleMetaEventData | HeartbeatMetaEventData): any {
    Logger.debug('meta_event :>> ', data)
  }

  /**
   * 处理请求事件
   * @param data 请求事件
   */
  @SubscribeMessage('request')
  request(@MessageBody() data: FriendRequestEventData | GroupRequestEventData): any {
    Logger.debug('request :>> ', data)
  }

  /**
   * 处理消息事件
   * @param data 消息事件
   */
  @SubscribeMessage('message')
  message(@MessageBody() data: PrivateMessageEventData | GroupMessageEventData): any {
    Logger.debug('message :>> ', data)
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
    Logger.debug('notice :>> ', data)
  }

}