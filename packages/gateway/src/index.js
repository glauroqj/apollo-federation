const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const supergraphSdl = ""; // TODO!

const gateway = new ApolloGateway({
  supergraphSdl,
});

const server = new ApolloServer({
  gateway,
});

server
  .listen()
  .then(({ url }) => {
    console.log(`🚀 Apollo Gateway ready at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });
