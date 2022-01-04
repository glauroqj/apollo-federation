const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "cats", url: "http://localhost:4006" },
    { name: "goats", url: "http://localhost:4007" },
  ],
});

const server = new ApolloServer({
  gateway,
  // Subscriptions are not currently supported in Apollo Federation
  subscriptions: false,
});

server
  .listen()
  .then(({ url }) => {
    console.log(`🚀 Gateway ready at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });

/**
 * DOC: https://www.apollographql.com/docs/federation/v2
 */
