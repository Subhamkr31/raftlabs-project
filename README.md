# Task Management API

A modern task management system built with Node.js, TypeScript, GraphQL, MongoDB, and Redis.

## Features

- 🔐 User authentication (JWT)
- 👤 User management
- ✅ Task CRUD operations
- 🔄 Real-time updates
- 📊 Task filtering and sorting
- 🚀 Performance optimization with Redis caching

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- npm or yarn

## Development Setup

### Using Docker (Recommended)

1. Install Docker and Docker Compose on your machine
2. Start the services:

```bash
docker-compose up -d
```

This will start:
- MongoDB (localhost:27017)
- Redis (localhost:6379)
- Mongo Express (UI) (http://localhost:8081)
- Redis Commander (UI) (http://localhost:8082)

### Environment Variables

1. Create a `.env` file in the root directory with the following variables:

 MONGO_URI=mongodb://localhost:27017/task-1
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your_jwt_secret
PORT=5000

4. Start the development server:

npm run dev


src/
├── config/ # Configuration files
├── models/ # MongoDB models
├── resolvers/ # GraphQL resolvers
├── schemas/ # GraphQL type definitions
├── middleware/ # Custom middleware
├── utils/ # Utility functions
└── index.ts # Application entry point