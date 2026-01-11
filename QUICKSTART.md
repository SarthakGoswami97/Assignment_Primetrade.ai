# Quick Start Guide

## 🚀 One-Time Setup (5 minutes)

### 1️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

**Edit `.env` file:**
```
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@YOUR_CLUSTER.mongodb.net/fsd-app
JWT_SECRET=your_super_secret_jwt_key_12345
PORT=5000
```

### 2️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```

Verify `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3️⃣ MongoDB Setup (Choose One)

**Option A: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster
3. Get connection string
4. Add to backend `.env`

**Option B: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service
- Use: `MONGODB_URI=mongodb://localhost:27017/fsd-app`

---

## ▶️ Running the Application

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
Output: `Server running on http://localhost:5000`

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
Output: `Local: http://localhost:3000`

---

## 🧪 Test the Application

1. Open http://localhost:3000 in browser
2. Click "Sign Up" → Create account
3. You'll be redirected to dashboard
4. **Create a task**: Click "+ New Task" button
5. **Test filters**: Use search, status, and priority filters
6. **Update task**: Click dropdown to change status
7. **Edit profile**: Click your name in navbar
8. **Logout**: Click logout button (redirects to login)

---

## 📝 Quick API Testing with Postman

1. Import `Postman_Collection.json` in Postman
2. Set environment variable `baseUrl` = `http://localhost:5000/api`
3. Run requests in order:
   - Signup (saves token)
   - Login
   - Create Task
   - Get All Tasks
   - Update Task
   - Delete Task

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in `.env` or kill process |
| Port 3000 in use | Next.js will use 3001, or kill process |
| MongoDB connection error | Check connection string and network access |
| CORS error | Verify backend CORS is enabled |
| Token not saving | Check localStorage in browser DevTools |
| Tasks not showing | Login first, check backend is running |

---

## 📁 File Structure Summary

```
FSD intern/
├── backend/
│   ├── models/          (User, Task schemas)
│   ├── routes/          (auth, tasks, user endpoints)
│   ├── middleware/      (JWT authentication)
│   ├── server.js        (Express app)
│   └── package.json
├── frontend/
│   ├── app/             (pages: login, signup, dashboard, profile)
│   ├── components/      (Navbar, TaskForm, TaskList)
│   ├── lib/             (api, ProtectedRoute)
│   └── package.json
├── README.md            (Full documentation)
├── DEPLOYMENT_SCALING.md (Production guide)
└── Postman_Collection.json (API testing)
```

---

## ✅ Features Implemented

✅ User Registration with validation  
✅ Password hashing with bcrypt  
✅ JWT Authentication  
✅ Protected routes (frontend + backend)  
✅ User profile management  
✅ Create, Read, Update, Delete tasks  
✅ Search functionality  
✅ Filter by status and priority  
✅ Responsive design (TailwindCSS)  
✅ Logout functionality  
✅ Error handling  
✅ API documentation  
✅ Scalable architecture  

---

## 🎯 Next Steps

1. **Test everything** - Create tasks, update, delete, filter
2. **Review code** - Check components, routes, models
3. **Commit to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Full-stack task manager"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
4. **Deploy** - Follow `DEPLOYMENT_SCALING.md`

---

## 📞 Support

- Check `README.md` for detailed documentation
- Check `DEPLOYMENT_SCALING.md` for production setup
- Review Postman collection for API examples

**Happy coding! 🚀**

