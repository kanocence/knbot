import { Injectable } from "@nestjs/common";
import { LifecycleModule } from "./lifecycle";

/** 导出注册方法 */
@Injectable()
export class RegisterMetaEventModules {

  constructor(
    private lifecucleModule: LifecycleModule
  ) { }

  register() {
    return [this.lifecucleModule]
  }
}

/** 导出message模块 */
export const MetaEventModules = [RegisterMetaEventModules, LifecycleModule]
