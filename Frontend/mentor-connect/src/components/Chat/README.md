# WebSocket Chat Implementation for MentorConnect

This directory contains the real-time chat implementation for MentorConnect using WebSockets.

## Components

1. **WebSocketService.js** - Manages WebSocket connections using STOMP over SockJS.
2. **ChatRoom.jsx** - Main component that handles listing chat rooms and selecting conversations.
3. **Chat.jsx** - Handles individual chat sessions with message display and input.

## How It Works

1. The WebSocket connection is established when a user navigates to the Messages page.
2. Messages are sent and received in real-time through STOMP protocol.
3. The user can see a list of their conversations and select one to chat.
4. Chat history is fetched from the server when a conversation is selected.

## Backend API Requirements

The chat functionality requires these backend endpoints:

### REST Endpoints:

- `GET /api/user/profile` - Get current user details
- `GET /api/chat/rooms` - Get all chat rooms for the current user
- `GET /api/chat/history/{chatRoomId}` - Get chat history for a specific room
- `POST /api/chat/room` - Create a new chat room

### WebSocket Endpoints:

- `/ws` - WebSocket connection endpoint
- `/app/chat.send` - Destination for sending messages
- `/topic/chat/{chatRoomId}` - Topic for receiving messages in a specific chat room
- `/user/{email}/queue/messages` - User-specific queue for private messages

## Message Format

Messages sent and received follow this structure:

```json
{
  "chatRoomId": "room-123",
  "sender": "user@example.com",
  "senderName": "User Name",
  "receiver": "mentor@example.com",
  "receiverName": "Mentor Name",
  "content": "Hello, how are you?",
  "timestamp": "2023-07-25T12:34:56.789Z"
}
```

## Integration With Other Components

The chat system is integrated with the following components:

1. **FindingMentor.jsx** - Students can start a chat with a mentor from the mentors list
2. **StudentDashboard.jsx** - Students can access recent conversations from their dashboard
3. **Messages.jsx** - Main entry point for the chat functionality

## Authentication

Authentication is handled by passing the JWT token with each WebSocket connection and REST API call:

1. JWT token is retrieved from localStorage
2. Token is included in the WebSocket connection headers
3. Token is automatically included in REST API calls through the axiosConfig interceptor 