import { Injectable, Logger } from '@nestjs/common'
import { GroupMessageEventData, Module, PrivateMessageEventData } from 'src';
import { BotService } from './bot.service';

@Injectable()
export class MessageService {

  commonMethods: Module[] = []
  privateMethods: Module[] = []
  groupMethods: Module[] = []

  constructor(private botService: BotService) { }

  on(module: Module, type?: MessageType | MessageType[]) {
    if (typeof type === 'object') {
      type.forEach(i => this[i + 'Methods'].push(module))
    } else if (typeof type === 'string') {
      this[type + 'Methods'].push(module)
    } else {
      this.commonMethods.push(module)
    }
  }

  private(data: PrivateMessageEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data, this.botService.send)
      }
    })

    this.privateMethods.find(i => i.validator(data))?.processor(data, this.botService.send)
  }

  group(data: GroupMessageEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data, this.botService.send)
      }
    })

    this.groupMethods.find(i => i.validator(data))?.processor(data, this.botService.send)
  }
}

export type MessageType = 'private' | 'group'