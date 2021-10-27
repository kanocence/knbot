import { Injectable } from '@nestjs/common';
import { group } from 'console';
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
    return bots
  }

  async getBotDetails(id: string | number) {
    // query friends list
    const friends = await this.botService.get_friend_list({ self_id: Number(id) }).then(res => res.data)
    // query friends info
    await Promise.all(friends.map(async friend =>
      await this.botService.get_stranger_info({ self_id: Number(id) }, friend.user_id)
        .then(res => { friend = Object.assign(friend, res.data) })
    ))
    // query groups list
    const groups = await this.botService.get_group_list({ self_id: Number(id) }).then(res => res.data)
    // query group admins
    await Promise.all(groups.map(async group => {
      group.admins = []
      return await this.botService.get_group_member_list({ self_id: Number(id) }, group.group_id)
        .then(async groupMembers => {
          // get admins && owner info
          await Promise.all(groupMembers.data.filter(member => member.role === 'admin')
            .map(async admin => await this.botService.get_stranger_info({ self_id: Number(id) }, admin.user_id)
              .then(res => { group.admins.push(Object.assign(admin, res.data)) })))

          await Promise.all(groupMembers.data.filter(member => member.role === 'owner')
            .map(async owner => await this.botService.get_stranger_info({ self_id: Number(id) }, owner.user_id)
              .then(res => { group.owner = Object.assign(owner, res) })))
        })
    }))
    return { friends: friends, groups: groups }
  }
}
