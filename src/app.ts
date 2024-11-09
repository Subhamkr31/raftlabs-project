import { connectDB } from './config/dbConfig';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { typeDefs } from './schema/typeDefs';
import { userResolver } from './resolvers/userResolver';
import { verifyToken } from './utils/jwtUtils';
import { JwtPayload } from 'jsonwebtoken';

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: userResolver.Query,
    Mutation: userResolver.Mutation,
  },
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    
    // Skip token verification for login and register mutations
    const isAuthRoute = req.body.query?.includes('login') || req.body.query?.includes('register');
    if (isAuthRoute) {
      return { user: null };
    }
  
    // For other routes, require token
    if (!token) {
      throw new AuthenticationError('Authentication token is required');
    }

    try {
      const user = verifyToken(token.replace('Bearer ', '')) as JwtPayload;
      return { user };
    } catch (err) {
      throw new AuthenticationError('Invalid or expired token');
    }
  },
});

const startServer = async () => {
  // Connect to MongoDB first using the imported function
  await connectDB();

  await server.start();
  server.applyMiddleware({
    app:app as any,
    cors: {
      credentials: true,
      origin: true,
    },
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};  

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});   