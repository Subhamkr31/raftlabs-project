import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloError } from 'apollo-server-errors';
import express, { Express, Application } from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers/resolvers';
import { initializeSocketIO } from './socket/socketHandler';
import { JWT_SECRET, User, } from './config/constant';
 

// Set up the server with Express
const app: Express = express();
const httpServer = http.createServer(app);

// Initialize Socket.IO and attach it to the same HTTP server
const io = new SocketIOServer(httpServer);
initializeSocketIO(io);
// Initialize Apollo Server
const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers:resolvers(io),
  }),
  context: async ({ req }: { req: express.Request }) => {
    // More reliable way to check for login mutation
    if (req?.body?.query && 
        req.body.query.includes('mutation') && 
        req.body.query.includes('login')) {
      return { user: null };
    }

    // For all other operations, require authentication
    if (!req?.headers?.authorization) {
      throw new ApolloError('Authentication token is missing', 'UNAUTHENTICATED', {
        details: 'Please add an Authorization header with format: { "Authorization": "Bearer <your_token>" }'
      });
    }

    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token || token === 'Bearer') {
      throw new ApolloError('Invalid token format', 'INVALID_TOKEN_FORMAT', {
        details: 'Token format should be: Bearer <your_token>'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user: User = {
        id: (decoded as any).id,
        username: (decoded as any).username
      };
      return { user };
    } catch (err) {
      throw new ApolloError('Authentication failed', 'UNAUTHENTICATED', {
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  },
  formatError: (error) => {
    if (error instanceof ApolloError) {
      return {
        message: error.message,
        extensions: error.extensions,
      };
    }
    return error;
  },
});

async function startServer() {
  await server.start();

  // Add this line to parse JSON bodies
  app.use(express.json());

  // Apply Apollo middleware with JWT authentication and context
  server.applyMiddleware({ 
    app: app as any,
    path: '/graphql',
  });

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(err => console.error('Failed to start server:', err));
