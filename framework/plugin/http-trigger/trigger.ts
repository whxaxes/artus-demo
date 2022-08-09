import { Context, Next } from '@artus/pipeline';
import { Trigger, DefineTrigger } from '@artus/core';
import { HTTP_OUTPUT, KOA_CONTEXT } from './lib/constant';
import { Context as KoaContext } from 'koa';

@DefineTrigger()
export default class KoaTrigger extends Trigger {
  constructor() {
    super();

    // first of all
    this.use(async (ctx: Context, next: Next) => {
      await next();

      try {
        await this.respond(ctx);
      } catch (err) {
        if (err.name !== 'NotFoundError') {
          throw err;
        }
      }
    });
  }

  async respond(ctx: Context) {
    const response: any = ctx.container.get(HTTP_OUTPUT);
    const koaCtx = ctx.container.get<KoaContext>(KOA_CONTEXT);
    if (response.body) {
      koaCtx.body = response.body;
      koaCtx.status = response.status || koaCtx.status;
      response.headers && Object.entries(response.headers)
        .forEach(([ key, value ]: [ string, string ]) => {
          koaCtx.set(key, value);
        });

      return;
    }

    koaCtx.body = response;
  }
}
