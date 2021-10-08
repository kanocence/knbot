import { Injectable, Logger } from '@nestjs/common'
import { FriendRequestEventData, GroupRequestEventData, RequestModule } from 'src'

@Injectable()
export class RequestService {

  private readonly logger = new Logger(RequestService.name)

  commonMethods: RequestModule[] = []
  friendMethods: RequestModule[] = []
  groupMethods: RequestModule[] = []

  on(module: RequestModule) {
    const type = module.type
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
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.friendMethods.find(i => i.validator(data))?.processor(data)
  }

  group(data: GroupRequestEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.groupMethods.find(i => i.validator(data))?.processor(data)
  }
}

export type NoticeType = 'friend' | 'group'