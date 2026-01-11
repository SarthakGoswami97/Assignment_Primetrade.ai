# FSD Task Manager - Web Application

A scalable, production-ready web application with authentication, user dashboard, and task management. Built with Next.js (frontend) and Express.js (backend).

## 📁 Project Structure

```
├── frontend/                 # Next.js React application
│   ├── app/                 # App router pages
│   │   ├── page.tsx        # Home/redirect page
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   ├── dashboard/      # Protected dashboard
│   │   └── profile/        # User profile management
│   ├── components/          # Reusable React components
│   │   ├── Navbar.tsx      # Navigation with logout
│   │   ├── TaskForm.tsx    # Modal for creating tasks
│   │   └── TaskList.tsx    # Task list with CRUD
│   ├── lib/                # Utilities
│   │   ├── api.ts          # Axios instance with token interceptor
│   │   └── ProtectedRoute.tsx # Route protection HOC
│   └── package.json
│
└── backend/                 # Express.js Node server
    ├── models/             # Mongoose schemas
    │   ├── User.js         # User schema with bcrypt hashing
    │   └── Task.js         # Task schema with user reference
    ├── routes/             # API endpoints
    │   ├── auth.js         # /signup, /login endpoints
    │   ├── tasks.js        # CRUD operations on tasks
    │   └── user.js         # Profile endpoints
    ├── middleware/         # Custom middleware
    │   └── auth.js         # JWT verification middleware
    ├── server.js           # Express app setup
    ├── package.json        # Dependencies
    └── .env.example        # Environment variables template
```

## 🚀 Features

### ✅ Authentication & Security
- User signup/login with email validation
- Password hashing with bcryptjs (10 salt rounds)
- JWT-based token authentication
- Protected routes (frontend & backend)
- Token stored in localStorage (frontend)
- Authorization middleware on protected endpoints

### ✅ User Management
- User profile display (name, email, bio, avatar)
- Profile update functionality
- User-specific data isolation (tasks)
- Join date tracking

### ✅ Task Management (CRUD)
- **Create**: Add new tasks with title, description, priority, and due date
- **Read**: Display all user tasks with filtering
- **Update**: Change task status (pending, in-progress, completed)
- **Delete**: Remove tasks with confirmation

### ✅ Dashboard Features
- Real-time statistics (total, completed, pending, in-progress)
- Advanced search functionality
- Filter by status and priority
- Responsive grid layout
- Task priority badges (low, medium, high)
- Status indicators with color coding

### ✅ UI/UX
- Responsive design (mobile, tablet, desktop)
- TailwindCSS styling for fast development
- Loading states and error handling
- User-friendly forms with validation
- Clean navigation bar
- Logout functionality

### ✅ Scalability & Code Quality
- Modular component structure
- Reusable API utilities with axios interceptors
- Environment-based configuration
- Error handling middleware
- Database indexing on frequently queried fields (email, userId)
- RESTful API design

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas cloud)

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fsd-app
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Update `.env.local` if backend URL is different:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start frontend development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

### Database Setup (MongoDB)

**Option A: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get connection string
3. Add connection string to `.env` file

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/fsd-app`

---

## 📚 API Documentation

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Task Endpoints (Protected - Requires JWT Token)

#### Get All Tasks with Filters
```http
GET /api/tasks?status=pending&priority=high&search=urgent&sortBy=createdAt
Authorization: Bearer <JWT_TOKEN>

Response:
[
  {
    "_id": "65abc456...",
    "title": "Complete project",
    "description": "Finish the FSD assignment",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-01-15",
    "userId": "65abc123...",
    "createdAt": "2026-01-09T10:30:00Z",
    "updatedAt": "2026-01-09T10:30:00Z"
  }
]
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Buy milk, eggs, bread",
  "priority": "low",
  "dueDate": "2026-01-10"
}

Response:
{
  "message": "Task created successfully",
  "task": { ... }
}
```

#### Update Task
```http
PUT /api/tasks/65abc456...
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the FSD assignment",
  "status": "completed",
  "priority": "high"
}

Response:
{
  "message": "Task updated successfully",
  "task": { ... }
}
```

#### Delete Task
```http
DELETE /api/tasks/65abc456...
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "message": "Task deleted successfully"
}
```

### User Profile Endpoints

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "_id": "65abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Software developer",
  "avatar": "https://...",
  "createdAt": "2026-01-09T10:30:00Z"
}
```

#### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "bio": "Senior software developer",
  "avatar": "https://new-avatar-url.com"
}

Response:
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## 🔒 Security Features

1. **Password Security**: Bcryptjs with 10 salt rounds
2. **Token-Based Auth**: JWT tokens with secret key
3. **Protected Routes**: Frontend client-side protection + backend middleware
4. **Input Validation**: Both client and server-side validation
5. **Authorization**: User data isolation (users can only access their own data)
6. **CORS**: Configured to accept requests from frontend
7. **Error Handling**: Safe error messages (no sensitive info exposure)

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  bio: String (optional),
  avatar: String,
  createdAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  status: String (enum: pending, in-progress, completed),
  priority: String (enum: low, medium, high),
  dueDate: Date (optional),
  userId: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌱 Scalability & Production Considerations

### Frontend Optimizations
- **Code Splitting**: Next.js automatically splits code per route
- **Image Optimization**: Use Next.js Image component for automatic optimization
- **Lazy Loading**: Implement dynamic imports for heavy components
- **State Management**: Consider Redux/Zustand for complex state (not needed now)
- **Caching**: Implement SWR or React Query for better data fetching

### Backend Enhancements
- **Database Indexing**: Add indexes on frequently queried fields
  ```javascript
  db.users.createIndex({ email: 1 })
  db.tasks.createIndex({ userId: 1, createdAt: -1 })
  ```
- **Pagination**: Implement pagination for large datasets
- **Rate Limiting**: Add rate limiting to prevent abuse
- **Logging**: Implement Winston/Morgan for logging
- **Caching**: Use Redis for session caching
- **API Versioning**: Structure routes as `/api/v1/...`
- **Load Balancing**: Deploy multiple instances behind load balancer

### Deployment
- **Frontend**: Deploy to Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Deploy to Heroku, Railway, AWS EC2, or DigitalOcean
- **Database**: Use MongoDB Atlas for managed database
- **Environment Variables**: Use deployment platform's secrets manager

---

## 🧪 Testing the Application

1. **Open frontend**: `http://localhost:3000`
2. **Sign up** with a new account
3. **Create tasks** with different priorities and due dates
4. **Use filters** to search and filter tasks
5. **Update task status** by selecting from dropdown
6. **Edit profile** with new information
7. **Logout** and login to verify persistence

---

## 📋 Postman Collection

Import the following into Postman:

```json
{
  "info": {
    "name": "FSD Task Manager API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/signup",
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"John\",\"email\":\"john@test.com\",\"password\":\"pass123\",\"confirmPassword\":\"pass123\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"john@test.com\",\"password\":\"pass123\"}"
            }
          }
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Get All Tasks",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/tasks",
            "header": {
              "Authorization": "Bearer {{token}}"
            }
          }
        },
        {
          "name": "Create Task",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/tasks",
            "header": {
              "Authorization": "Bearer {{token}}"
            },
            "body": {
              "mode": "raw",
              "raw": "{\"title\":\"New Task\",\"description\":\"Task desc\",\"priority\":\"high\"}"
            }
          }
        }
      ]
    }
  ]
}
```

**Environment Variables for Postman**:
- `baseUrl`: `http://localhost:5000/api`
- `token`: (Set after login from response)

---

## 🤝 Contributing & Best Practices

### Code Style
- Use TypeScript for type safety
- Follow ESLint/Prettier for formatting
- Keep functions small and focused
- Use meaningful variable names

### Git Workflow
```bash
git init
git add .
git commit -m "Initial commit: Full-stack task manager app"
git branch -M main
git remote add origin <your-repo>
git push -u origin main
```

---

## 📝 License

This project is part of the FSD Internship Assignment.

---

## ✅ Checklist for Submission

- [x] Frontend built with React (Next.js)
- [x] Responsive design with TailwindCSS
- [x] User authentication (signup/login/logout)
- [x] Protected routes (JWT + frontend guard)
- [x] Backend with Express.js
- [x] MongoDB database connection
- [x] Password hashing with bcrypt
- [x] CRUD operations on tasks entity
- [x] User profile management
- [x] Search and filter functionality
- [x] Error handling & validation
- [x] API documentation
- [x] Scalable project structure
- [x] GitHub repo with clean commits

---

## 🎯 Next Steps (Post-Submission Improvements)

1. Add email verification during signup
2. Implement forgot password functionality
3. Add task categories/tags
4. Implement task priorities & recurring tasks
5. Add notification system
6. Deploy to production (Vercel + Railway/Heroku)
7. Add testing (Jest, React Testing Library)
8. Implement dark mode
9. Add WebSocket for real-time updates
10. Add file upload for profile pictures

