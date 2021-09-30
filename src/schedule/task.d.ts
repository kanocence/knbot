/** B站空间订阅 */
export type BiliLiveTaskData = {
  /** bilibili UID */
  uid: number
  /** bilibili 用户名称 */
  name: string
  /** 存储任意信息 */
  info?: any
  /** 记录是否发送过 */
  flag: boolean
  /** bot信息 */
  bot: {
    id: number
    /** 订阅的群号 */
    group?: {
      /** at all */
      at: boolean
      id: number
    }[]
    /** 订阅的用户 */
    user?: number[]
  }[]
}