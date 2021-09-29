import * as WebSocket from 'ws';
import { WebSocketAdapter, INestApplicationContext, Logger } from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { CommonEventData } from './ws';

export class WsAdapter implements WebSocketAdapter {

  constructor(private app: INestApplicationContext) { }

  create(port: number, options: any = {}): any {
    Logger.log('ws create')
    return new WebSocket.Server({ port, ...options })
  }

  bindClientConnect(server, callback: Function) {
    Logger.log('ws bindClientConnect, server:\n', server)
    server.on('connection', callback)
  }

  bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    Logger.log('new connect')
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
      Logger.error('Error parsing json: ', error)
      return EMPTY
    }

    const messageHandler = handlers.find(
      handler => handler.message === message.post_type
    )
    if (!messageHandler) {
      Logger.warn('No message handler: ' + JSON.stringify(message))
      return EMPTY
    }
    return process(messageHandler.callback(message))
  }

  close(server) {
    Logger.log('ws server close')
    server.close()
  }
}