import { Inject } from '@artus/core';
import {
  WebSocketController,
  WebSocketEvent,
  WebSocket,
  WebSocketConnection,
  WebSocketEvents,
} from 'ws-trigger';

@WebSocketController('/')
export class WSController {
  @Inject()
  ws: WebSocket;

  @Inject()
  conn: WebSocketConnection;

  @WebSocketEvent(WebSocketEvents.CONNECTION)
  async onConnection() {
    this.ws.send('hello ' + this.conn.clients.length);
  }

  @WebSocketEvent(WebSocketEvents.MESSAGE)
  async onMessage(data) {
    console.info('received message: %s', data);
  }
}
