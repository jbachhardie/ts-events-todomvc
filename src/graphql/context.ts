import { EventEmitter } from "events";
import {
  Dispatcher,
  EventPayloads,
  Service,
  ServiceContext,
} from "../services/service";
import { UserService } from "../services/user";

const SERVICE_LIST: Service[] = [UserService];

export type GraphQLContext = {
  dispatch: Dispatcher;
  waitForEvent<TEventName extends keyof EventPayloads>(
    eventName: TEventName
  ): Promise<EventPayloads[TEventName]>;
};

export function contextFactory(): GraphQLContext {
  const emitter = new EventEmitter();
  const serviceContext: ServiceContext = {
    dispatch: (eventName, payload) =>
      setImmediate(() => emitter.emit(eventName, payload)),
  };
  for (const service of SERVICE_LIST) {
    for (const event of Object.keys(service)) {
      emitter.on(event, (payload) => {
        service[event](payload, serviceContext);
      });
    }
  }
  return {
    dispatch: serviceContext.dispatch,
    waitForEvent: (eventName) => {
      return new Promise((resolve, reject) => {
        emitter.on(eventName, resolve);
        emitter.on("error", reject);
      });
    },
  };
}
