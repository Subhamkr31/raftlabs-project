import { gql } from 'apollo-server-express';

// Define GraphQL schema
export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Room {
    id: ID!
    name: String!
    participants: [User!]!
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    roomId: ID!
  }

  type Query {
    rooms: [Room!]!
    messages(roomId: ID!): [Message!]!
  }

  type Mutation {
    login(username: String!, password: String!): String!
    joinRoom(roomId: ID!): Room
    leaveRoom(roomId: ID!): Boolean!
    sendMessage(roomId: ID!, content: String!): Message
  }

  type Subscription {
    messageSent(roomId: ID!): Message
  }
`;
