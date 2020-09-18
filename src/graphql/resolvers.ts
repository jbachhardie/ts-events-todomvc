import { Resolvers } from "../generated/graphql";
import { GraphQLContext } from "./context";

export const resolvers: Resolvers<GraphQLContext> = {
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
