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

const startApolloServer = async () => {
  const PORT = process?.env?.PORT || 4000;
  // const app = express();
  // const httpServer = http.createServer(app);
  const server = new ApolloServer({
    gateway,
    subscriptions: false,
  });

  server
    .listen({
      port: PORT,
      url: "/graphql",
    })
    .then(({ url }) => {
      console.log(`🚀 Apollo Gateway is ready at ${url}`);
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
