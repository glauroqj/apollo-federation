import { ApolloServer } from "apollo-server";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";

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
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      name,
      willSendRequest({ request, context }) {
        const applicationTypeHeader =
          context?.req?.headers["x-application-type"];
        const operationName = context.req.body.operationName;
        console.log("< GATEWAY > ", name, url, operationName);

        request.http.headers.set("x-application-type", applicationTypeHeader);
        request.http.headers.set("x-application-operation-name", operationName);
      },
    });
  },
});

const startApolloServer = async () => {
  const PORT = process?.env?.PORT || 4000;
  // const app = express();
  // const httpServer = http.createServer(app);
  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    introspection: true,
    context: ({ req }) => ({
      req,
    }),
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
