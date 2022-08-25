import {
  ArtusApplication,
  LifecycleHookUnit,
  ApplicationLifecycle,
  LifecycleHook,
  ArtusInjectEnum,
} from '@artus/core';

import { WebSocketServer } from 'ws';
import { AddressInfo } from 'node:net';
import http, { Server } from 'node:http';
import { register } from './lib/router';
import { WsTrigger } from './trigger';
import { Inject, Container } from '@artus/injection';

@LifecycleHookUnit()
export default class WsApp implements ApplicationLifecycle {
  private wss: WebSocketServer;

  @Inject(ArtusInjectEnum.Application)
  private app: ArtusApplication;

  @Inject()
  container: Container;

  @Inject()
  trigger: WsTrigger;

  @LifecycleHook('didReady')
  async startWsServer() {
    let server: Server;

    try {
      server = this.container.get(Server);
    } catch(e) {
      server = http.createServer();
      await new Promise(resolve => server.listen(this.app.config.port || 0, () => resolve(true)));
      this.container.set({ id: Server, value: server });
    }

    const address = server.address() as AddressInfo;
    console.log(`WS Server start listening at ws://127.0.0.1:${address.port}`);

    this.wss = new WebSocketServer({ server });
    this.container.set({ id: WebSocketServer, value: this.wss });
    register(this.wss, this.trigger);
  }

  @LifecycleHook()
  async beforeClose() {
    this.wss?.close();
  }
}
