import { Injectable } from "@nestjs/common";
import { BiliLiveTaskModule } from "./live.task";
import { RepeatModule } from "./repeat";
import { RestartModule } from "./restart";
import { SetuModule } from "./setu";

/** 导出注册方法 */
@Injectable()
export class RegisterMessageModules {

  constructor(
    private biliTaskModule: BiliLiveTaskModule, private setuModule: SetuModule,
    private restartModule: RestartModule, private repeatModule: RepeatModule
  ) { }

  register() {
    return [this.biliTaskModule, this.setuModule, this.restartModule, this.repeatModule]
  }
}

/** 导出message模块 */
export const MessageModules = [RegisterMessageModules, BiliLiveTaskModule, SetuModule, RestartModule,
  RepeatModule]
