import { ApolloServer } from "apollo-server";

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
      console.log(`🚀 Apollo Server - DOGS - is ready at ${url}dogs/graphql`);
    })
    .catch((err) => {
      console.error(err);
    });
};

startApolloServer();
