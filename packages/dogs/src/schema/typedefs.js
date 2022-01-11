// import { gql } from "apollo-server-express";
import { gql } from "apollo-server";
import DogsDefs from "typedefs/Dogs.graphql";

const graphqlTypeDefs = gql`
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  # LOOK TO QUERIES FILES
  type Query {
    ImagesDog: Dogs
  }
`;

const typedefs = [graphqlTypeDefs, DogsDefs];

export default typedefs;
