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
      const applicationTypeHeader = context?.fullHeaders["x-application-type"];
      const operationName =
        context?.fullHeaders["x-application-operation-name"];

      // console.log(
      //   `[ REQUEST ][ ${applicationTypeHeader} ][ ${operationName} ]`,
      //   payload
      // );

      return {
        async willSendResponse(requestContext) {
          const { request, response, context } = requestContext;

          // const _getDataValue = () => {
          //   const cloneData = Object.assign({}, response?.data)

          //   for (const value in cloneData) {
          //     const data = cloneData[value]
          //     console.log( JSON.stringify(data).length )
          //   }
          // }

          const payload = {
            response: {
              errors: response?.errors || "none",
              data: JSON.stringify({ ...response?.data }),
              extensions: response?.extensions || "none",
            },
          };

          console.log(
            `[ DOGS ][ RESPONSE ][ ${applicationTypeHeader} ][ ${operationName} ]`,
            payload
          );
        },
      };
    }
  },
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
      logs,
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
