import { Inject, Injectable, ScopeEnum } from '@artus/core';
import { Request as KoaRequest } from 'koa';
import { KOA_REQUEST } from '../constant';

@Injectable({ scope: ScopeEnum.EXECUTION })
export default class Request {
  @Inject(KOA_REQUEST)
  private req: KoaRequest;

  get header() {
    return this.req.header;
  }

  get headers() {
    return this.req.headers;
  }

  get url() {
    return this.req.url;
  }

  get origin() {
    return this.req.origin;
  }

  get href() {
    return this.req.href;
  }

  get method() {
    return this.req.method;
  }

  get path() {
    return this.req.path;
  }

  get query() {
    return this.req.query;
  }

  get ip() {
    return this.req.ip;
  }

  get originalUrl() {
    return this.req.originalUrl;
  }
}

export { Request };
