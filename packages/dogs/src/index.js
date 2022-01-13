import { ApolloServer } from "apollo-server";
import { ApolloServerPluginCacheControl } from "apollo-server-core";

import { buildSubgraphSchema } from "@apollo/federation";
import { typedefs, resolvers } from "schema/index.js";
/** data sources */
import DogsAPI from "datasources/dogsDS.js";
/** utils */
// import Logger from "utils/Logger.js";
/** cache */
import Redis from "ioredis";
import { BaseRedisCache } from "apollo-server-cache-redis";
import responseCachePlugin from "apollo-server-plugin-response-cache";

require("dotenv").config();

const RedisIO = Redis;

const createRedisCLient = () => {
  const client = new RedisIO({
    host: process.env.REDIS_HOSTS,
  });

  client.on("ready", (msg) => {
    console.info(
      `< 🦾 Apollo Server - DOGS - Redis : Status > ${msg ? msg : ""}`
    );

    client.select(Number(0), (error, res) => {
      if (res)
        console.info(`< ✅ Apollo Server - DOGS - Redis : Select > ${res}`);
      if (error)
        console.error(
          `< 🚩 Apollo Server Redis : Error > ${error ? error : ""}`
        );
    });
    // if (process.env.REDIS_DB !== "0") {
    // }
  });

  return client;
};

const startApolloServer = async () => {
  const PORT = process?.env?.PORT || 4001;

  const server = new ApolloServer({
    cache: new BaseRedisCache({
      client: createRedisCLient(),
    }),
    schema: buildSubgraphSchema({
      typeDefs: typedefs,
      resolvers,
    }),
    dataSources: () => ({
      dogsApi: new DogsAPI(),
    }),
    context: ({ req }) => {
      return {
        fullHeaders: req.headers,
      };
    },
    plugins: [
      responseCachePlugin(),
      ApolloServerPluginCacheControl({
        defaultMaxAge: 60,
        calculateHttpHeaders: true,
      }),
    ],
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
