import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WsAdapter } from './websocket/ws.adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['debug', 'error', 'warn', 'log', 'verbose'] })
  app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(16701)
}
bootstrap()
