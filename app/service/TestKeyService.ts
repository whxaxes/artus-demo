import { Injectable, ScopeEnum } from '@artus/core';


@Injectable({ scope: ScopeEnum.EXECUTION })
export class TestKeyService {
  async getKey() {
    return 'testKey';
  }
}
