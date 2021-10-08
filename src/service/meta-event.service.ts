import { Injectable, Logger } from '@nestjs/common'
import { HeartbeatMetaEventData, LifecycleMetaEventData, MeatEventModule } from 'src'

@Injectable()
export class MetaEventService {

  private readonly logger = new Logger(MetaEventService.name)

  commonMethods: MeatEventModule[] = []
  lifecycleMethods: MeatEventModule[] = []
  heartbeatModules: MeatEventModule[] = []

  on(module: MeatEventModule) {
    const type = module.type
    if (typeof type === 'object') {
      type.forEach(i => this[i + 'Methods'].push(module))
    } else if (typeof type === 'string') {
      this[type + 'Methods'].push(module)
    } else {
      this.commonMethods.push(module)
    }
  }

  lifecycle(data: LifecycleMetaEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.lifecycleMethods.find(i => i.validator(data))?.processor(data)
  }

  heartbeat(data: HeartbeatMetaEventData) {
    this.commonMethods.forEach(i => {
      if (i.validator(data)) {
        i.processor(data)
      }
    })

    this.heartbeatModules.find(i => i.validator(data))?.processor(data)
  }
}