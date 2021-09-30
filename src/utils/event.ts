import { ArrayMessageAt, Message, ArrayMessageText } from "src"

/**
 * 判断是否@某人(以@某人为开头)
 * @param msg 消息数组或消息字符串
 * @param id QQ
 * @returns Boolean
 */
export function isAt(msg: string | ArrayMessageAt[], id: number): boolean {
  return typeof msg === 'string' ?
    new RegExp(`\^(\\[CQ:at,qq=)(${id})(\\])`).test(msg) :
    msg[0]?.type === 'at' && msg[0]?.data?.qq?.toString() === id.toString()
}

/**
 * 消息是否完全相等
 * @param msg 消息数组或消息字符串
 * @param str 要比较的值
 * @returns Boolean
 */
export function messageEq(msg: string | Message[], str: string): boolean {
  return typeof msg === 'string' ?
    msg === str :
    msg.length === 1 && msg[0].type === 'text' && msg[0].data?.text === str
}

/**
 * 消息是否以`msg`开头
 * @param msg 消息数组或消息字符串
 * @param str 要比较的值
 * @returns Boolean
 */
export function messageOp(msg: string | Message[], str: string): boolean {
  return typeof msg === 'string' ?
    msg.trim().indexOf(str) === 0 :
    msg[0]?.type === 'text' && (msg[0].data?.text?.toString().trim().includes(str) ?? false)
}

/**
 * 消息是否包含`msg`
 * @param msg 消息数组或消息字符串
 * @param str 要比较的值
 * @returns Boolean
 */
export function messageIn(msg: string | Message[], str: string): boolean {
  return typeof msg === 'string' ?
    msg.includes(str) :
    (msg.findIndex(i => i.type === 'text' && (i.data?.text?.toString().trim().includes(str) ?? false)) > -1)
}

/**
 * 判断消息是否符合正则
 * @param msg 要判断的消息
 * @param reg 正则表达式
 * @returns boolean
 */
export function messageReg(msg: string | Message[], reg: RegExp) {
  const str = (msg as Message[])
    .filter(i => i.type === 'text')
    .reduce((res, i) => res + (i as ArrayMessageText).data.text, '')
  return typeof msg === 'string' ? reg.test(msg) : reg.test(str)
}