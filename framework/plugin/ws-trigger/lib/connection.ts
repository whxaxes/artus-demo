import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'node:http';
import { WS_REQUEST } from './constant';
import { ReqUrlSymbol } from './router';
import { Injectable, Inject, ScopeEnum } from '@artus/core';

@Injectable({
  scope: ScopeEnum.EXECUTION,
})
export default class WebSocketConnection {
  @Inject()
  wss: WebSocketServer;

  @Inject(WS_REQUEST)
  req: IncomingMessage;

  get clients() {
    const clients = Array.from(this.wss.clients.values());
    return clients.filter(client => client[ReqUrlSymbol] === this.req.url);
  }
}
