import {
  ArtusApplication,
  LifecycleHookUnit,
  ApplicationLifecycle,
  LifecycleHook,
  ArtusInjectEnum,
} from '@artus/core';

import { AddressInfo } from 'node:net';
import http, { Server } from 'node:http';

import { Inject, Container } from '@artus/injection';
import * as constant from './lib/constant';

import { Context as KoaContext } from 'koa';
import { Application } from './lib/proto';
import { Router, registerRouters } from './lib/router';
import { HttpTrigger } from './trigger';

@LifecycleHookUnit()
export default class App implements ApplicationLifecycle {
  private server: Server;

  @Inject(ArtusInjectEnum.Application)
  private app: ArtusApplication;

  @Inject()
  container: Container;

  @Inject()
  koaApp: Application;

  @Inject()
  koaRouter: Router;

  @Inject()
  trigger: HttpTrigger;

  @LifecycleHook('willReady')
  async initKoaApp() {
    this.koaApp.use(async (koaCtx: KoaContext, next) => {
      const ctx = await this.trigger.initContext();
      koaCtx.artusCtx = ctx;

      // set execution container
      ctx.container.set({ id: constant.KOA_CONTEXT, value: koaCtx });
      ctx.container.set({ id: constant.KOA_REQUEST, value: koaCtx.request });
      ctx.container.set({ id: constant.KOA_RESPONSE, value: koaCtx.response });

      await next();
    });

    this.koaApp.use(this.koaRouter.routes());
    this.koaApp.use(this.koaRouter.allowedMethods());
    registerRouters(this.koaRouter);

    // start artus pipeline in last koa middleware
    this.koaApp.use(async (koaCtx: KoaContext) => {
      await this.trigger.startPipeline(koaCtx.artusCtx);
    });
  }

  @LifecycleHook('didReady')
  async startHttpServer() {
    const server = this.server = http.createServer(this.koaApp.callback());
    await new Promise(resolve => server.listen(this.app.config.port || 0, () => resolve(true)));
    this.container.set({ id: Server, value: server });
    const address = server.address() as AddressInfo;
    console.log(`HTTP Server start listening at http://127.0.0.1:${address.port}`);
  }

  @LifecycleHook()
  async beforeClose() {
    this.server?.close();
  }
}
