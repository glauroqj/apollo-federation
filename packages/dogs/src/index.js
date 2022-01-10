import { ApolloServer } from "apollo-server";

import { buildSubgraphSchema } from "@apollo/federation";
import { typedefs, resolvers } from "schema/index.js";
/** data sources */
import DogsAPI from "datasources/dogsDS.js";
/** utils */
// import Logger from "utils/Logger.js";
/** cache */
import { BaseRedisCache } from "apollo-server-cache-redis";
import Redis from "ioredis";
import responseCachePlugin from "apollo-server-plugin-response-cache";

require("dotenv").config();

const RedisIO = Redis;

const createRedisCLient = () => {
  const client = new RedisIO({
    host: "apollo_federation_skeleton_local_redis",
  });

  client.on("ready", (msg) => {
    logger.info(
      `< 🦾 Apollo Server - DOGS - Redis : Status > ${msg ? msg : ""}`
    );

    if (process.env.REDIS_DB !== "0") {
      client.select(Number(0), (error, res) => {
        if (res)
          logger.info(`< ✅ Apollo Server - DOGS - Redis : Select > ${res}`);
        if (error)
          logger.error(
            `< 🚩 Apollo Server Redis : Error > ${error ? error : ""}`
          );
      });
    }
  });

  return client;
};

const startApolloServer = async () => {
  const PORT = process?.env?.PORT || 4001;
  // const app = express();

  // const httpServer = http.createServer(app);
  const server = new ApolloServer({
    cache: new BaseRedisCache({
      client: createRedisCLient(),
    }),
    cacheControl: {
      defaultMaxAge: 20,
      calculateHttpHeaders: true,
    },
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
    plugins: [responseCachePlugin()],
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
