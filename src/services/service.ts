import { EventPayloads } from "./events";

export type Dispatcher = <TEventName extends keyof EventPayloads>(
  eventName: TEventName,
  payload: EventPayloads[TEventName]
) => void;

export type ServiceContext = {
  dispatch: Dispatcher;
};

export type Handler<TPayload> = (
  payload: TPayload,
  context: ServiceContext
) => void;

export type Service = {
  [TEventName in keyof EventPayloads]?: Handler<EventPayloads[TEventName]>;
};
