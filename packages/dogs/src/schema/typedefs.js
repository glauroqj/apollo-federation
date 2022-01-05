import { gql } from "apollo-server-express";

import DogsDefs from "typedefs/Dogs.graphql";

const graphqlTypeDefs = gql`
  # LOOK TO QUERIES FILES
  type Query {
    ImagesDog: Dogs
  }
`;

const typedefs = [graphqlTypeDefs, DogsDefs];

export default typedefs;
