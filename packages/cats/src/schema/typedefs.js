// import { gql } from "apollo-server-express";
import { gql } from "apollo-server";
import CatsDefs from "typedefs/Cats.graphql";

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
    ImagesSearch: Cats
  }
`;

const typedefs = [graphqlTypeDefs, CatsDefs];

export default typedefs;
