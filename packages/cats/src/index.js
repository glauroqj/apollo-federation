import { ApolloServer } from "apollo-server";

import { buildSubgraphSchema } from "@apollo/federation";

import { typedefs, resolvers } from "schema/index.js";
/** data sources */
import CatsAPI from "datasources/catsDS.js";
// /** utils */
// import Logger from "utils/Logger.js";
require("dotenv").config();

const startApolloServer = async () => {
  const PORT = process?.env?.PORT || 4002;
  // const app = express();
  // const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema: buildSubgraphSchema({
      typeDefs: typedefs,
      resolvers,
    }),
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
    plugins: [],
  });

  server
    .listen({
      port: PORT,
      url: "/cats/graphql",
    })
    .then(({ url }) => {
      console.log(`🚀 Apollo Server - CATS - is ready at ${url}/cats/graphql`);
    })
    .catch((err) => {
      console.error(err);
    });
};

startApolloServer();
