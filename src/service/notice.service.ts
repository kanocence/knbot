import { Injectable } from '@nestjs/common'
import { FriendRecallNoticeEventData, GroupAdminNoticeEventData, GroupBanNoticeEventData, GroupDecreaseNoticeEventData, GroupIncreaseNoticeEventData, GroupRecallNoticeEventData, GroupUploadNoticeEventData, HonorNoticeEventData, LuckyKingNoticeEventData, Module, PockNoticeEventData } from 'src';

@Injectable()
export class NoticeService {

  commonMethods: Module[] = []
  group_uploadMethods: Module[] = []
  group_adminMethods: Module[] = []
  group_decreaseMethods: Module[] = []
  group_increaseMethods: Module[] = []
  group_banMethods: Module[] = []
  friend_addMethods: Module[] = []
  group_recallMethods: Module[] = []
  notifyMethods: Module[] = []

  on(module: Module, type?: NoticeType | NoticeType[]) {
    if (typeof type === 'object') {
      type.forEach(i => this[i + 'Methods'].push(module))
    } else if (typeof type === 'string') {
      this[type + 'Methods'].push(module)
    } else {
      this.commonMethods.push(module)
    }
  }

  group_upload(data: GroupUploadNoticeEventData) {
  }

  group_admin(data: GroupAdminNoticeEventData) {
  }

  group_decrease(data: GroupDecreaseNoticeEventData) {
  }

  group_increase(data: GroupIncreaseNoticeEventData) {
  }

  group_ban(data: GroupBanNoticeEventData) {
  }

  friend_add(data: FriendRecallNoticeEventData) {
  }

  group_recall(data: GroupRecallNoticeEventData) {
  }

  notify(data: HonorNoticeEventData | LuckyKingNoticeEventData | PockNoticeEventData) {
  }
}

export type NoticeType = 'group_upload' | 'group_admin' | 'group_decrease' | 'group_increase' |
  'group_ban' | 'friend_add' | 'group_recall' | 'notify'