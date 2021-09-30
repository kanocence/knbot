import * as WebSocket from 'ws';
import { WebSocketAdapter, INestApplicationContext, Logger } from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { CommonEventData } from 'src';

export class WsAdapter implements WebSocketAdapter {

  private readonly logger = new Logger(WsAdapter.name)

  constructor(private app: INestApplicationContext) { }

  create(port: number, options: any = {}): any {
    this.logger.log('ws create')
    return new WebSocket.Server({ port, ...options })
  }

  bindClientConnect(server, callback: Function) {
    this.logger.log('ws bind client connect')
    server.on('connection', callback)
  }

  bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    this.logger.log('new connect')
    fromEvent(client, 'message')
      .pipe(
        mergeMap(data => this.bindMessageHandler(client, data, handlers, process)),
        filter(result => result),
      )
      .subscribe(response => client.send(JSON.stringify(response)))
  }

  bindMessageHandler(
    client: WebSocket,
    buffer,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ): Observable<any> {
    let message: CommonEventData
    try {
      message = JSON.parse(buffer.data)
    } catch (error) {
      this.logger.error('Error parsing json: ', error)
      return EMPTY
    }

    const messageHandler = handlers.find(
      handler => handler.message === message.post_type
    )
    if (!messageHandler) {
      this.logger.warn('No message handler: ' + JSON.stringify(message))
      return EMPTY
    }
    return process(messageHandler.callback(message))
  }

  close(server) {
    this.logger.log('ws server close')
    server.close()
  }
}