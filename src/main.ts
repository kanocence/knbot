import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WsAdapter } from './websocket/ws.adapter'

async function bootstrap() {
  const { server, log } = global.config
  new Logger('bootstrap').log('The api runs on port :>> ' + server['api-port'])
  const app = await NestFactory.create(AppModule, { logger: log })
  app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(server['api-port'])
}
bootstrap()
