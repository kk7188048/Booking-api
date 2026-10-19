# Session Booking API

REST API for a platform where users can book sessions with teachers.

## Tech Stack

Node.js, TypeScript, Express.js, MongoDB, Mongoose

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/session-booking
```

3. Start the server:
```bash
npm run dev
```

4. Build and run:
```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /users | Create a new user |
| POST | /teachers | Create a new teacher |
| POST | /sessions | Create a new session |
| GET | /sessions/available?dateTimestamp={ms} | Get available sessions for a date |
| POST | /sessions/:id/book | Book a session |
| PATCH | /sessions/:id/complete | Mark session as completed |
| GET | /users/:id/sessions | Get user's upcoming and completed sessions |

## Testing

Import `postman_collection.json` into Postman to test all endpoints.
