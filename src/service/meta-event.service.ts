import { Injectable, Logger } from '@nestjs/common'
import { HeartbeatMetaEventData, LifecycleMetaEventData, Module } from 'src'

@Injectable()
export class MetaEventService {

  private readonly logger = new Logger(MetaEventService.name)

  commonMethods: Module[] = []
  lifecycleMethods: Module[] = []
  heartbeatModules: Module[] = []

  on(module: Module, type?: MetaEventType | MetaEventType[]) {
    if (typeof type === 'object') {
      type.forEach(i => this[i + 'Methods'].push(module))
    } else if (typeof type === 'string') {
      this[type + 'Methods'].push(module)
    } else {
      this.commonMethods.push(module)
    }
  }

  lifecycle(data: LifecycleMetaEventData) {

  }

  heartbeat(data: HeartbeatMetaEventData) {

  }
}

export type MetaEventType = 'lifecycle' | 'heartbeat'