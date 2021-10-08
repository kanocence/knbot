import { Injectable } from "@nestjs/common";

/** 导出注册方法 */
@Injectable()
export class RegisterNoticeModules {

  constructor(
   
  ) { }

  register() {
    return []
  }
}

/** 导出message模块 */
export const NoticeModules = [RegisterNoticeModules]
