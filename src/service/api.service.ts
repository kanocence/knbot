import { Injectable, Logger } from '@nestjs/common'
import { request } from 'src/utils/request';
import { AxiosResponse } from "axios"
import { Anonymous, ApiType, Bot, CommonEventData, Message } from 'src';

@Injectable()
export class ApiService {

  private readonly logger = new Logger(ApiService.name)

  /**
   * 韩小韩API接口 >>  获取QQ头像昵称API接口
   * @param id 
   * @returns 
   */
  async get_qq_info(id: string | number) {
    return await request({
      method: 'get',
      url: `https://api.vvhan.com/api/qq?qq=${id}`
    })
  }
}