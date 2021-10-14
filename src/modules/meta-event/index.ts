import { Injectable } from "@nestjs/common";
import { LoginModule } from "./login";

/** 导出注册方法 */
@Injectable()
export class RegisterMetaEventModules {

  constructor(
    private loginModule: LoginModule
  ) { }

  register() {
    return [this.loginModule]
  }
}

/** 导出message模块 */
export const MetaEventModules = [RegisterMetaEventModules, LoginModule]
