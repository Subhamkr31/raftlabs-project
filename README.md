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

## Installation

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