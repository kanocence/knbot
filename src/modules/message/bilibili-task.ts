import { Injectable, Logger } from "@nestjs/common"
import { CommonEventData, CommonMessageEventData, GroupMessageEventData, InstructionSet, Message, MessageModule, MessageType, PrivateMessageEventData } from "src";
import { BiliSpaceTask } from "src/schedule/space.task";
import { BotService } from "src/service/bot.service";
import { messageOp } from "src/utils/event";
import { request } from "src/utils/request";

@Injectable()
export class BiliSpaceTaskModule implements MessageModule {
  type: ['group', 'private'];

  CMD = 'bt'
  help: string =
    `
  用法:
    bt add [options] [uids...]
    bt rm [options] [uids...]
    bt ls [options]
  其中，选项options包括:
    -l 直播
    -s 空间动态
    -at @全体成员
  `
  instructionSet: InstructionSet = {
    add: {
      '-l': 'Live',
      '-s': 'Space',
      '-at': 'At',
    },
    rm: {
      '-l': 'Live',
      '-s': 'Space',
    },
    ls: {
      '-l': 'Live',
      '-s': 'Space',
    },
  }

  constructor() {

  }


  validator(msg: CommonMessageEventData): boolean {
    return msg.post_type === 'message' && messageOp(msg.message, this.CMD)
  }
  async processor(msg: GroupMessageEventData | PrivateMessageEventData) {
    msg.message
  }

  interpreter(set: InstructionSet, msg: string | Message[]): { type: string | undefined, options?: string[], args?: string[] } {
    // msg: Message[]
    if (typeof msg === 'object') {
      msg = msg.reduce((res, curr) => res += curr.type === 'text' ? curr.data : '', '')
    }

    // Split into an array and remove this.CMD
    const arr = msg.trim().split(' ')
    // received options
    const options = []
    // received args
    const args = []
    // remove "this.CMD"
    arr.shift()

    const type = arr.shift()
    const defOptions = type ? set.type : undefined
    if (defOptions) {
      arr.forEach(i => defOptions[i] ? options.push(i) : args.push(i))
      return { type: type, options: options, args: args }
    }

    return { type: 'help' }
  }

  findCmd() {

  }

  desc() {
    1
  }
}