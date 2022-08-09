import { Inject, Injectable, ScopeEnum } from '@artus/core';
import { Response as KoaResponse } from 'koa';
import { KOA_RESPONSE } from '../constant';

@Injectable({ scope: ScopeEnum.EXECUTION })
export default class Response {
  @Inject(KOA_RESPONSE)
  private res: KoaResponse;

  get status() {
    return this.res.status;
  }
}

export { Response };
