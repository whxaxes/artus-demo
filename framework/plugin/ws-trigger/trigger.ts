import { Trigger, Injectable, ScopeEnum } from '@artus/core';

@Injectable({
  scope: ScopeEnum.SINGLETON,
})
export default class WsTrigger extends Trigger {
}
