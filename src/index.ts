import { GraphQLServer } from "graphql-yoga";
import * as path from "path";
import { Resolvers } from "./generated/graphql";

const resolvers: Resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
  },
};

const server = new GraphQLServer({
  typeDefs: path.join(__dirname, "./schema.graphql"),
  resolvers,
});
server.start(() => console.log("Server is running on localhost:4000"));
