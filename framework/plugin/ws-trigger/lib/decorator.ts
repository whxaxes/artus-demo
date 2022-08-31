import { Injectable, ScopeEnum, addTag } from '@artus/core';
import { WS_EVENT_META, WS_CONTROLLER_TAG, WS_CONTROLLER_PATH } from './constant';

export interface EventParams {
  eventName: string;
}

export function WebSocketController(path: string): ClassDecorator {
  return (target: any) => {
    addTag(WS_CONTROLLER_TAG,  target);
    Reflect.defineMetadata(WS_CONTROLLER_PATH, path, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export function WebSocketEvent(eventName: EventParams | string): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    const params = typeof eventName === 'string' ? { eventName } : eventName;
    Reflect.defineMetadata(`${WS_EVENT_META}${propertyKey}`, params, target.constructor);
  };
}
