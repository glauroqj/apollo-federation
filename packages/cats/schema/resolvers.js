import { gql } from "apollo-server-express";

import CatsDefs from "typedefs/Cats.graphql";

const graphqlTypeDefs = gql`
  # LOOK TO QUERIES FILES
  type Query {
    Events: Events
    EventsByID(id: ID!): EventsByID
  }
`;

const typedefs = [graphqlTypeDefs, CatsDefs];

export default typedefs;
