import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { typedefs, resolvers } from "schema/index.js";
/** data sources */
import CatsAPI from "datasources/catsDS.js";
// /** utils */
// import Logger from "utils/Logger.js";

require("dotenv").config();

const startApolloServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: typedefs,
    resolvers,
    dataSources: () => ({
      catsApi: new CatsAPI(),
    }),
    context: ({ req }) => {
      return {
        fullHeaders: req.headers,
      };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Additional middleware can be mounted at this point to run before Apollo.
  // app.use('*', jwtCheck, requireAuth, checkScope)

  // Mount Apollo middleware here.
  server.applyMiddleware({ app, path: "/graphql" });

  await new Promise((resolve) =>
    httpServer.listen({ port: process?.env?.PORT || 4001 }, resolve)
  );

  console.log(
    `🚀 Apollo Server is ready at http://localhost:${
      process?.env?.PORT || 4001
    }${server.graphqlPath}`
  );
  return { server, app };
};

startApolloServer();
