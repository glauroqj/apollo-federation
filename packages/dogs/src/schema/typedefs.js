// import { gql } from "apollo-server-express";
import { gql } from "apollo-server";
import DogsDefs from "typedefs/Dogs.graphql";
import v1_app_DogsDefs from "typedefs/v1_app_Dogs.graphql";
import v2_app_DogsDefs from "typedefs/v2_app_Dogs.graphql";

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
    v1_app_ImagesDog: v1_app_Dogs
    v2_app_ImagesDog: v2_app_Dogs
  }
`;

const typedefs = [graphqlTypeDefs, DogsDefs, v1_app_DogsDefs, v2_app_DogsDefs];

export default typedefs;
