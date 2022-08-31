
import { Injectable, ScopeEnum } from '@artus/core';
import Koa from 'koa';

@Injectable({ scope: ScopeEnum.SINGLETON })
export default class Application extends Koa { }
export { Application };
