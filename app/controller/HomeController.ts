import { Inject } from '@artus/core';
import { HttpController, HttpMethod, HTTPMethodEnum, Request } from 'http-trigger';
import { TestKeyService } from '../service/TestKeyService';

@HttpController()
export class HomeController {
  @Inject()
  req: Request;

  @Inject()
  serv: TestKeyService;

  @HttpMethod({ method: HTTPMethodEnum.GET, path: '/' })
  async index() {
    const query = this.req.query;
    return {
      body: `Hello ${query.name || 'World'}!`,
    };
  }

  @HttpMethod({ method: HTTPMethodEnum.GET, path: '/test' })
  async test() {
    return {
      body: await this.serv.getKey(),
    };
  }
}
