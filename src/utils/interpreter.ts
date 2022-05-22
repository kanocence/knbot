import { InstructionSet, Message } from "src"

/**
 * 解析指令
 * @param set 指令集
 * @param msg 需要解析的msg
 * @returns 返回类型，选项和参数
 */
export function interpreter(set: InstructionSet, msg: string | Message[]): { type: string | undefined, options?: string[], args?: string[] } {
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