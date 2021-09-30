import { Injectable, Logger } from '@nestjs/common'
import { FriendRequestEventData, GroupRequestEventData, Module } from 'src'

@Injectable()
export class RequestService {

  private readonly logger = new Logger(RequestService.name)

  commonMethods: Module[] = []
  friendMethods: Module[] = []
  groupMethods: Module[] = []

  on(module: Module, type?: NoticeType | NoticeType[]) {
    if (typeof type === 'object') {
      type.forEach(i => this[i + 'Methods'].push(module))
    } else if (typeof type === 'string') {
      this[type + 'Methods'].push(module)
    } else {
      this.commonMethods.push(module)
    }
  }

  onRequest(type: 'friend' | 'group', module: any) {
    this[type + 'Methods'].push(module)
  }

  friend(data: FriendRequestEventData) {

  }

  group(data: GroupRequestEventData) {

  }
}

export type NoticeType = 'friend' | 'group'