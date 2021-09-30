import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WsAdapter } from './websocket/ws.adapter'

async function bootstrap() {
  const { server } = global.config
  console.log('The interface runs on port :>> ', server['api-port'])

  const app = await NestFactory.create(AppModule, { logger: ['debug', 'error', 'warn', 'log', 'verbose'] })
  app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(server['api-port'])
}
bootstrap()
