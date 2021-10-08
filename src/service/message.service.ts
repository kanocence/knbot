import { Injectable, Logger } from '@nestjs/common'
import { GroupMessageEventData, MessageModule, PrivateMessageEventData } from 'src';
import { BotService } from './bot.service';

@Injectable()
export class MessageService {

  private readonly logger = new Logger(MessageService.name)

  commonMethods: MessageModule[] = []
  privateMethods: MessageModule[] = []
  groupMethods: MessageModule[] = []

  constructor(private botService: BotService) { }

  on(module: MessageModule) {
    const type = module.type
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
        i.processor(data)
      }
    })

    this.privateMethods.find(i => i.validator(data))?.processor(data)
  }

  group(data: GroupMessageEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.groupMethods.find(i => i.validator(data))?.processor(data)
  }
}
