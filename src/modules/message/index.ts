import { Injectable } from "@nestjs/common";
import { HelloModule } from "./hello";
import { BiliLiveTaskModule } from "./live.task";
import { RepeatModule } from "./repeat";
import { RestartModule } from "./restart";
import { SetuModule } from "./setu";
import { BiliSpaceTaskModule } from "./space.task";

/** 导出注册方法 */
@Injectable()
export class RegisterMessageModules {

  constructor(
    private biliTaskModule: BiliLiveTaskModule, private setuModule: SetuModule,
    private restartModule: RestartModule, private repeatModule: RepeatModule,
    private biliSpaceTaskModule: BiliSpaceTaskModule, private helloModule: HelloModule
  ) { }

  register() {
    return [this.biliTaskModule, this.setuModule, this.restartModule, this.repeatModule,
    this.biliSpaceTaskModule, this.helloModule]
  }
}

/** 导出message模块 */
export const MessageModules = [RegisterMessageModules, BiliLiveTaskModule, SetuModule, RestartModule,
  RepeatModule, BiliSpaceTaskModule, HelloModule]
