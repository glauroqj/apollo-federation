import { ApolloServer } from "apollo-server";
import { ApolloServerPluginCacheControl } from "apollo-server-core";

import { buildSubgraphSchema } from "@apollo/federation";

import { typedefs, resolvers } from "schema/index.js";
/** data sources */
import CatsAPI from "datasources/catsDS.js";
// /** utils */
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
      `< 🦾 Apollo Server - CATS - Redis : Status > ${msg ? msg : ""}`
    );

    client.select(Number(1), (error, res) => {
      if (res)
        console.info(`< ✅ Apollo Server - CATS - Redis : Select > ${res}`);
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
  const PORT = process?.env?.PORT || 4002;

  const server = new ApolloServer({
    cache: new BaseRedisCache({
      client: createRedisCLient(),
    }),
    schema: buildSubgraphSchema({
      typeDefs: typedefs,
      resolvers,
    }),
    // typeDefs: typedefs,
    // resolvers,
    dataSources: () => ({
      catsApi: new CatsAPI(),
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
      url: "/cats/graphql",
    })
    .then(({ url }) => {
      console.log(`🚀 Apollo Server - CATS - is ready at ${url}cats/graphql`);
    })
    .catch((err) => {
      console.error(err);
    });
};

startApolloServer();
