import { GraphQLServer } from "graphql-yoga";
import * as path from "path";
import { contextFactory } from "./graphql/context";
import { resolvers } from "./graphql/resolvers";

const server = new GraphQLServer({
  context: contextFactory,
  typeDefs: path.join(__dirname, "./schema.graphql"),
  resolvers: resolvers,
});
server.start(() => console.log("Server is running on localhost:4000"));
