
import { Injectable } from '@artus/injection';
import Koa from 'koa';

@Injectable()
export default class Application extends Koa { }
export { Application };
