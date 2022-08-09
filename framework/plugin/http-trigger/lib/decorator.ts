import { Injectable, ScopeEnum } from '@artus/injection';
import { controllerMap } from './scope';
import { HTTPMethodEnum, HTTP_METHOD_META } from './constant';

export interface HttpParams {
  method: HTTPMethodEnum;
  path: string;
};

export function HttpController(): ClassDecorator {
  return (target: any) => {
    controllerMap.add({ clazz: target });
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export function HttpMethod(options: HttpParams): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(`${HTTP_METHOD_META}${propertyKey}`, options, target.constructor);
  };
}
