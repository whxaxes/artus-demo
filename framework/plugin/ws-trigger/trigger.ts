import { Trigger, Injectable, ScopeEnum } from '@artus/core';

@Injectable({ scope: ScopeEnum.SINGLETON })
export class WsTrigger extends Trigger {
}
