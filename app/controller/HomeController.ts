import { Inject } from '@artus/core';
import { HttpController, HttpMethod, HTTPMethodEnum, Request } from 'framework/plugin/http-trigger';

@HttpController()
export default class HomeController {
  @Inject()
  req: Request;

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
      body: '哟哟，切克闹',
    };
  }
}
