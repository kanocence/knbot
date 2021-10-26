import { Injectable } from '@nestjs/common';
import { FriendListRes, GroupListRes } from 'src';
import { LifecycleModule } from './modules/meta-event/lifecycle';
import { ApiService } from './service/api.service';
import { BotService } from './service/bot.service';

@Injectable()
export class AppService {

  constructor(private lifecycleModule: LifecycleModule, private botService: BotService,
    private apiService: ApiService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getBotList() {
    // register info(lifecycle && heart beats)
    let lcbots = this.lifecycleModule.bots ?? []
    // config info(config.yml)
    let confbots: { id: number, url: string, token: string }[] = global.config.bots
    // Merge info
    let bots: any = confbots.map(conf => Object.assign(lcbots.find(i => i.id == conf.id) ?? {}, conf))
    // query bot info
    await Promise.all(bots.map(async bot =>
      await this.botService.get_stranger_info({ self_id: bot.id }, bot.id)
        .then(res => { bot = Object.assign(bot, res.data) })
    ))
    // query bot avatar
    await Promise.all(bots.map(async bot =>
      await this.apiService.get_qq_info(bot.id)
        .then(res => { bot = Object.assign(bot, res) })
    ))
    return bots
  }

  async getBotDetails(id: string | number) {
    // query friends list
    let friends: FriendListRes[]
    await this.botService.get_friend_list({ self_id: Number(id) })
      .then(res => friends = res.data)
    // query friends avatar
    await Promise.all(friends.map(async f => {
      await this.apiService.get_qq_info(f.user_id)
        .then(res => { f = Object.assign(f, res) })
    }))
    // query groups list
    let groups: GroupListRes[]
    await this.botService.get_group_list({ self_id: Number(id) })
      .then(res => groups = res.data)
    // query groups avatar

    return null
  }
}
