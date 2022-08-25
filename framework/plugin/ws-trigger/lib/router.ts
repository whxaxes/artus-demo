import { controllerMap } from './scope';
import { WebSocketServer, WebSocket } from 'ws';
import { WsTrigger } from '../trigger';
import { WS_EVENT_META, WS_REQUEST, WebSocketEvents } from './constant';
import { EventParams } from './decorator';
export const ReqUrlSymbol = Symbol('request#url');

interface MatchClazz {
  clazz: any;
  events: Map<string, string[]>;
}

function initRules() {
  const rules: Map<string, Map<any, MatchClazz>> = new Map();
  controllerMap.forEach(info => {
    const propertyKeys = Reflect.getMetadataKeys(info.clazz);
    if (rules.has(info.path)) {
      throw new Error('register duplicate ws controller');
    }

    const matchClazz: Map<any, MatchClazz> = new Map();
    rules.set(info.path, matchClazz);
    propertyKeys.forEach(key => {
      if (typeof key !== 'string') return;
      if (!key.startsWith(WS_EVENT_META)) return;

      const meta: EventParams = Reflect.getMetadata(key, info.clazz);
      if (!matchClazz.has(info.clazz)) {
        matchClazz.set(info.clazz, { clazz: info.clazz, events: new Map() });
      }

      const existMatched = matchClazz.get(info.clazz)!;
      if (!existMatched.events.has(meta.eventName)) {
        existMatched.events.set(meta.eventName, []);
      }

      const eventList = existMatched.events.get(meta.eventName)!;
      eventList.push(key.substring(WS_EVENT_META.length));
    });
  });
  return rules;
}

export function register(
  wss: WebSocketServer,
  trigger: WsTrigger,
) {
  const rules = initRules();
  wss.on('connection', async (ws, req) => {
    const reqUrl = req.url;
    const matchClazz = rules.get(reqUrl);
    if (!matchClazz || !matchClazz.size) {
      return ws.close();
    }

    ws[ReqUrlSymbol] = reqUrl;
    const ctx = await trigger.initContext();
    ctx.container.set({ id: WebSocketServer, value: wss });
    ctx.container.set({ id: WebSocket, value: ws });
    ctx.container.set({ id: WS_REQUEST, value: req });

    console.info('[%s] New connection in %s', new Date().toLocaleString(), reqUrl);
    const dispatch = (eventName: string) => {
      return (...args: any[]) => {
        matchClazz.forEach(info => {
          const propKeys = info.events.get(eventName) || [];
          const instance = ctx.container.get(info.clazz);
          propKeys.forEach(key => instance[key](...args));
        });
      }
    }

    dispatch(WebSocketEvents.CONNECTION)();
    ws.on(WebSocketEvents.MESSAGE, dispatch(WebSocketEvents.MESSAGE));
  });
}

