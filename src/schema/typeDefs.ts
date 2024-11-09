import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User!]!
    
  }

  type Mutation {
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
  }
`; 