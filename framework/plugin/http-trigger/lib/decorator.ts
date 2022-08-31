import { addTag, Injectable, ScopeEnum } from '@artus/core';
import { HTTPMethodEnum, HTTP_METHOD_META, HTTP_CONTROLLER_TAG } from './constant';

export interface HttpParams {
  method: HTTPMethodEnum;
  path: string;
};

export function HttpController(): ClassDecorator {
  return (target: any) => {
    addTag(HTTP_CONTROLLER_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export function HttpMethod(options: HttpParams): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(`${HTTP_METHOD_META}${propertyKey}`, options, target.constructor);
  };
}
