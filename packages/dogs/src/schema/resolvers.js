import { ApolloError } from "apollo-server-express";

/** queries */
import DogsQuery from "datasources/dogsQuery.js";
import v1_app_DogsQuery from "datasources/v1_app_dogsQuery.js";
import v2_app_DogsQuery from "datasources/v2_app_dogsQuery.js";

const responseError = (error) => {
  const { message, extensions } = error;

  if (extensions?.response?.body?.errorMessage) {
    throw new ApolloError(
      message + " - " + extensions.response.body.errorMessage,
      extensions.response.body.errorCode
    );
  } else {
    throw new ApolloError(message, "No extensions on error");
  }
};

const resolvers = {
  Query: {
    ...DogsQuery(responseError),
    ...v1_app_DogsQuery(responseError),
    ...v2_app_DogsQuery(responseError),
  },
  // Mutation: {}
};

export default resolvers;
