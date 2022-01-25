import { ApolloServer } from "apollo-server";
import { ApolloGateway } from "@apollo/gateway";

import { readFileSync } from "fs";
import path from "path";

require("dotenv").config();

// console.log(readFileSync(path.join() + "/dist/supergraph.graphql").toString());

const supergraphSdl = readFileSync(
  path.join() + "/dist/supergraph.graphql"
).toString();

const gateway = new ApolloGateway({
  supergraphSdl,
  serviceList: [
    { name: "cats", url: "http://localhost:4002/cats/graphql" },
    { name: "dogs", url: "http://localhost:4001/dogs/graphql" },
  ],
});

const logs = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
    const { request, context } = requestContext;
    if (request.query.indexOf("IntrospectionQuery") < 0) {
      const payload = {
        request: {
          query: request?.query,
          variables: request?.variables,
        },
      };
    }
    const applicationTypeHeader = context?.fullHeaders["x-application-type"];
    console.log(`Application Type: ${applicationTypeHeader}`);

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart(requestContext) {
        console.log("Parsing started!");
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(requestContext) {
        console.log("Validation started!");
      },
    };
  },
};

const startApolloServer = async () => {
  const PORT = process?.env?.PORT || 4000;
  // const app = express();
  // const httpServer = http.createServer(app);
  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    introspection: true,
    plugins: [logs],
    context: ({ req }) => {
      return {
        fullHeaders: req.headers,
      };
    },
  });

  server
    .listen({
      port: PORT,
      url: "/graphql",
    })
    .then(({ url }) => {
      console.log(`🚀 Apollo Gateway is ready at ${url}graphql`);
    })
    .catch((err) => {
      console.error(err);
    });
};

startApolloServer();

/**
 * DOC: https://www.apollographql.com/docs/federation/quickstart/
 *  yarn rover supergraph compose --config ./supergraph-config.yaml > dist/supergraph.graphql
 */
