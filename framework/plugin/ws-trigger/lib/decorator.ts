import { Injectable, ScopeEnum } from '@artus/core';
import { controllerMap } from './scope';
import { WS_EVENT_META } from './constant';

export interface EventParams {
  eventName: string;
}

export function WebSocketController(path: string): ClassDecorator {
  return (target: any) => {
    controllerMap.add({ clazz: target, path });
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export function WebSocketEvent(eventName: EventParams | string): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    const params = typeof eventName === 'string' ? { eventName } : eventName;
    Reflect.defineMetadata(`${WS_EVENT_META}${propertyKey}`, params, target.constructor);
  };
}
