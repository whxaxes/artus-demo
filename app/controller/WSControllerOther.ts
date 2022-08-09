import { Inject } from '@artus/core';
import {
  WebSocketController,
  WebSocketEvent,
  WebSocket,
  WebSocketConnection,
  WebSocketEvents,
} from 'ws-trigger';

@WebSocketController('/other')
export default class WSControllerOther {
  @Inject()
  ws: WebSocket;

  @Inject()
  conn: WebSocketConnection;

  @WebSocketEvent(WebSocketEvents.CONNECTION)
  async onConnection() {
    this.ws.send('hello ' + this.conn.clients.length);

    // brocast to other client
    this.conn.clients
      .filter(client => client !== this.ws)
      .forEach(client => client.send('new connection'));
  }

  @WebSocketEvent(WebSocketEvents.MESSAGE)
  async onMessage(data) {
    console.info('received message: %s', data);
  }
}
