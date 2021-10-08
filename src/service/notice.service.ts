import { Injectable, Logger } from '@nestjs/common'
import { FriendRecallNoticeEventData, GroupAdminNoticeEventData, GroupBanNoticeEventData, GroupDecreaseNoticeEventData, GroupIncreaseNoticeEventData, GroupRecallNoticeEventData, GroupUploadNoticeEventData, HonorNoticeEventData, LuckyKingNoticeEventData, NoticeModule, PockNoticeEventData } from 'src';

@Injectable()
export class NoticeService {

  private readonly logger = new Logger(NoticeService.name)

  commonMethods: NoticeModule[] = []
  group_uploadMethods: NoticeModule[] = []
  group_adminMethods: NoticeModule[] = []
  group_decreaseMethods: NoticeModule[] = []
  group_increaseMethods: NoticeModule[] = []
  group_banMethods: NoticeModule[] = []
  friend_addMethods: NoticeModule[] = []
  group_recallMethods: NoticeModule[] = []
  notifyMethods: NoticeModule[] = []

  on(module: NoticeModule) {
    const type = module.type
    if (typeof type === 'object') {
      type.forEach(i => this[i + 'Methods'].push(module))
    } else if (typeof type === 'string') {
      this[type + 'Methods'].push(module)
    } else {
      this.commonMethods.push(module)
    }
  }

  group_upload(data: GroupUploadNoticeEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.group_uploadMethods.find(i => i.validator(data))?.processor(data)
  }

  group_admin(data: GroupAdminNoticeEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.group_adminMethods.find(i => i.validator(data))?.processor(data)
  }

  group_decrease(data: GroupDecreaseNoticeEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.group_decreaseMethods.find(i => i.validator(data))?.processor(data)
  }

  group_increase(data: GroupIncreaseNoticeEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.group_increaseMethods.find(i => i.validator(data))?.processor(data)
  }

  group_ban(data: GroupBanNoticeEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.group_banMethods.find(i => i.validator(data))?.processor(data)
  }

  friend_add(data: FriendRecallNoticeEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.friend_addMethods.find(i => i.validator(data))?.processor(data)
  }

  group_recall(data: GroupRecallNoticeEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.group_recallMethods.find(i => i.validator(data))?.processor(data)
  }

  notify(data: HonorNoticeEventData | LuckyKingNoticeEventData | PockNoticeEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.notifyMethods.find(i => i.validator(data))?.processor(data)
  }
}

export type NoticeType = 'group_upload' | 'group_admin' | 'group_decrease' | 'group_increase' |
  'group_ban' | 'friend_add' | 'group_recall' | 'notify'