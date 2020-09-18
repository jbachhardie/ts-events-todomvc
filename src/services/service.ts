import { User } from "../graphql/codegen-types";

export type EventPayloads = {
  "user:requestToRegisterReceived": {
    username: string;
    password: string;
  };
  "user:created": {
    newUser: User;
  };
  "user:requestToAuthoriseReceived": {
    username: string;
    password: string;
  };
  "user:authorised": {
    authToken: string;
  };
  error: Error;
};

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
