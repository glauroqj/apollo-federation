import http from "http";
import express from "express";

import { ApolloServer } from "apollo-server";

import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { buildSubgraphSchema } from "@apollo/federation";
import { typedefs, resolvers } from "schema/index.js";
/** data sources */
import DogsAPI from "datasources/dogsDS.js";
// /** utils */
// import Logger from "utils/Logger.js";
require("dotenv").config();

const startApolloServer = async () => {
  const PORT = process?.env?.PORT || 4001;
  // const app = express();

  // const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema: buildSubgraphSchema({
      typeDefs: typedefs,
      resolvers,
    }),
    // typeDefs: typedefs,
    // resolvers,
    dataSources: () => ({
      dogsApi: new DogsAPI(),
    }),
    context: ({ req }) => {
      return {
        fullHeaders: req.headers,
      };
    },
    plugins: [],
  });

  server
    .listen({
      port: PORT,
      url: "/dogs/graphql",
    })
    .then(({ url }) => {
      console.log(`🚀 Apollo Server - DOGS - is ready at ${url}/dogs/graphql`);
    })
    .catch((err) => {
      console.error(err);
    });
};

startApolloServer();

// import http from "http";
// import express from "express";
// import { ApolloServer } from "apollo-server-express";
// import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
// import { buildSubgraphSchema } from "@apollo/federation";
// import { typedefs, resolvers } from "schema/index.js";
// /** data sources */
// import DogsAPI from "datasources/dogsDS.js";
// // /** utils */
// // import Logger from "utils/Logger.js";
// require("dotenv").config();

// const startApolloServer = async () => {
//   const app = express();

//   const httpServer = http.createServer(app);
//   const server = new ApolloServer({
//     schema: buildSubgraphSchema([
//       {
//         typeDefs: typedefs,
//         resolvers,
//       },
//     ]),
//     typeDefs: typedefs,
//     resolvers,
//     dataSources: () => ({
//       dogsApi: new DogsAPI(),
//     }),
//     context: ({ req }) => {
//       return {
//         fullHeaders: req.headers,
//       };
//     },
//     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   });

//   await server.start();

//   // Additional middleware can be mounted at this point to run before Apollo.
//   // app.use('*', jwtCheck, requireAuth, checkScope)

//   // Mount Apollo middleware here.
//   server.applyMiddleware({ app, path: "/dogs/graphql" });

//   await new Promise((resolve) =>
//     httpServer.listen({ port: process?.env?.PORT || 4006 }, resolve)
//   );

//   console.log(
//     `🚀 Apollo Server is ready at http://localhost:${
//       process?.env?.PORT || 4006
//     }${server.graphqlPath}`
//   );
//   return { server, app };
// };

// startApolloServer();
