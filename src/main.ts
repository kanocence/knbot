import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import { TransformInterceptor } from './interceptor/transform.interceptor'
import { WsAdapter } from './websocket/ws.adapter'

async function bootstrap() {
  const { server, log } = global.config
  new Logger('bootstrap').log('The api runs on port :>> ' + server['api-port'])
  const app = await NestFactory.create(AppModule, { logger: log })
  app.useWebSocketAdapter(new WsAdapter(app))
  // 注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  // 注册请求拦截器
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(server['api-port'])
}
bootstrap()
