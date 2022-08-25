import { Injectable, ScopeEnum } from '@artus/core';
import { Context } from '@artus/pipeline';
import EggRouter from '@eggjs/router';
import { controllerMap } from './scope';
import { HttpParams } from './decorator';
import { HTTP_OUTPUT, HTTP_METHOD_META } from './constant';

@Injectable({ scope: ScopeEnum.SINGLETON })
export default class Router extends EggRouter {}

export function registerRouters(router: Router) {
  controllerMap.forEach(({ clazz }) => {
    const keys = Reflect.getMetadataKeys(clazz)
      .filter(k => typeof k === 'string' && k.startsWith(HTTP_METHOD_META));

    keys.forEach(metaKey => {
      const meta: HttpParams = Reflect.getMetadata(metaKey, clazz);
      const propKey = metaKey.substring(HTTP_METHOD_META.length);
      const { method, path } = meta;
      router[method.toLowerCase()](propKey, path, async (koaCtx, next) => {
        const startTime = Date.now();
        const artusCtx: Context = koaCtx.artusCtx;
        const controllerInstance = artusCtx.container.get(clazz);
        const result = await controllerInstance[propKey]();
        console.info('[%s] Request: %s %s, Cost: %sms', new Date().toLocaleString(), method, path, Date.now() - startTime);
        artusCtx.container.set({ id: HTTP_OUTPUT, value: result });
        await next();
      });
    });
  });
}

export { Router };
