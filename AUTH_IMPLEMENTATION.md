# Multi-User Authentication Implementation

This project now includes a complete multi-user authentication system with user-specific chat history management.

## 🚀 Features Added

### 1. **User Authentication**
- User registration with email, username, and password
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Protected API routes

### 2. **Database Integration**
- SQLite database with Prisma ORM
- User, Chat, and Message models
- Automatic database migrations
- User-specific data isolation

### 3. **User Management**
- Individual user accounts
- Personal chat history per user
- Account settings and profile management
- Secure logout functionality

### 4. **Enhanced UI**
- Login/Register forms with validation
- Authentication status in sidebar
- Guest mode for anonymous users
- Responsive design for all screen sizes

## 🗄️ Database Schema

```sql
User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String   (hashed)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  chats     Chat[]
}

Chat {
  id        String   @id @default(cuid())
  userId    String
  title     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User
  messages  Message[]
}

Message {
  id        String   @id @default(cuid())
  chatId    String
  role      String   // "user" or "assistant"
  content   String
  createdAt DateTime @default(now())
  chat      Chat
}
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Chat Management
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/[id]` - Get specific chat
- `PUT /api/chats/[id]` - Update chat title
- `DELETE /api/chats/[id]` - Delete chat
- `POST /api/chats/[id]/messages` - Save chat messages

## 🏗️ Architecture

### Frontend
- **Zustand** for state management (auth + chat stores)
- **React Context** for authentication provider
- **Custom hooks** for authentication logic
- **Protected routes** with middleware

### Backend
- **Prisma** for database ORM
- **JWT** for session management
- **bcryptjs** for password hashing
- **Zod** for request validation

## 🔧 Environment Variables

Add to your `.env` file:
```env
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
DATABASE_URL="file:./dev.db"
OLLAMA_URL="http://localhost:11434"
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Navigate to authentication:**
   - Visit `/auth` to register or login
   - Or continue as guest from the main page

## 🔄 Migration from Anonymous

Existing anonymous users can:
- Continue using the app without authentication
- Register an account to save their chat history
- Login to access saved chats across devices

## 🛡️ Security Features

- Password hashing with bcryptjs (12 rounds)
- JWT tokens with 7-day expiration
- Protected API routes with token validation
- User data isolation in database
- XSS protection with proper sanitization

## 📱 User Experience

### Anonymous Users
- Can use the app immediately
- Data stored locally in browser
- Prompted to sign up for persistence

### Authenticated Users
- Persistent chat history across devices
- Secure account management
- Personalized experience with username display
- Data automatically synced to database

## 🧪 Testing

Test the authentication flow:

1. **Register a new account** at `/auth`
2. **Create multiple chats** and verify they persist
3. **Logout and login** to confirm data persistence
4. **Switch between anonymous and authenticated** modes

The implementation provides a seamless user experience with optional authentication while maintaining backward compatibility for existing users.
