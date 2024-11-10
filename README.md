# Real-Time Chat Application

A real-time chat application built with GraphQL, Socket.IO, and TypeScript.

## 🚀 Features

- Real-time messaging using Socket.IO
- GraphQL API for data operations
- JWT Authentication
- Room-based chat system
- TypeScript support

## 🛠️ Tech Stack

- **Backend**
  - Node.js
  - Express
  - Apollo Server
  - Socket.IO
  - TypeScript
  - JWT for authentication

## 📁 Project Structure

## 🔍 Postman Collection Guide

### Available Endpoints

#### Authentication
- **Login**
  - Method: POST
  - Endpoint: `/graphql`
  - Body: 
    ```json
    {
      "query": "mutation($username: String!, $password: String!) { login(username: $username, password: $password) }",
      "variables": {
        "username": "testuser",
        "password": "testpassword"
      }
    }
    ```

#### Room Operations
- **Join Room**
  - Method: POST
  - Endpoint: `/graphql`
  - Auth: Required
  - Body:
    ```json
    {
      "query": "mutation JoinRoom($roomId: ID!) { joinRoom(roomId: $roomId) { id name participants { id username } } }",
      "variables": {
        "roomId": "1"
      }
    }
    ```

- **Leave Room**
  - Method: POST
  - Endpoint: `/graphql`
  - Auth: Required
  - Body:
    ```json
    {
      "query": "mutation LeaveRoom($roomId: ID!) { leaveRoom(roomId: $roomId) }",
      "variables": {
        "roomId": "1"
      }
    }
    ```

#### Messages
- **Send Message**
  - Method: POST
  - Endpoint: `/graphql`
  - Auth: Required
  - Body:
    ```json
    {
      "query": "mutation SendMessage($roomId: ID!, $content: String!) { sendMessage(roomId: $roomId, content: $content) { id content sender { id username } roomId } }",
      "variables": {
        "roomId": "1",
        "content": "Hello, everyone!"
      }
    }
    ```

### Using the Collection

1. Import the collection into Postman
2. Set up environment variables:
   - `baseUrl`: Your API URL (default: http://localhost:4000)
   - `authToken`: JWT token (obtained from login response)
3. Execute login first to get the auth token
4. Use the token for subsequent requests