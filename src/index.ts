import { GraphQLServer } from "graphql-yoga";
import * as path from "path";
import { EventEmitter } from "events";
import { Resolvers } from "./generated/graphql";
import {
  ServiceContext,
  Dispatcher,
  EventPayloads,
  Service,
} from "./services/service";
import { UserService } from "./services/user";

type GraphQLContext = {
  dispatch: Dispatcher;
  waitForEvent<TEventName extends keyof EventPayloads>(
    eventName: TEventName
  ): Promise<EventPayloads[TEventName]>;
};

const serviceList: Service[] = [UserService];

function contextFactory(): GraphQLContext {
  const emitter = new EventEmitter();
  const serviceContext: ServiceContext = {
    dispatch: (eventName, payload) =>
      setImmediate(() => emitter.emit(eventName, payload)),
  };
  for (const service of serviceList) {
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

const resolvers: Resolvers<GraphQLContext> = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
  },
  Mutation: {
    register: async (_, { username, password }, { dispatch, waitForEvent }) => {
      dispatch("user:requestToRegisterReceived", { username, password });
      return waitForEvent("user:created");
    },
  },
};

const server = new GraphQLServer({
  context: contextFactory,
  typeDefs: path.join(__dirname, "./schema.graphql"),
  resolvers,
});
server.start(() => console.log("Server is running on localhost:4000"));
