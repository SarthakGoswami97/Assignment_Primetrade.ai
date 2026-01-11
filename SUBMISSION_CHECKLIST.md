# ✅ FSD Assignment - Submission Checklist

## 📋 Before You Start

- [ ] Node.js v14+ installed
- [ ] MongoDB account created (Atlas or local)
- [ ] Git installed
- [ ] Text editor/IDE ready
- [ ] GitHub account created

---

## 🚀 Setup Checklist

### Backend
- [ ] Navigate to `backend/` folder
- [ ] Run `npm install`
- [ ] Create `.env` from `.env.example`
- [ ] Add MongoDB connection string
- [ ] Add JWT_SECRET (random string)
- [ ] Run `npm run dev` - server starts on port 5000
- [ ] Test endpoint: http://localhost:5000/api/health

### Frontend
- [ ] Navigate to `frontend/` folder
- [ ] Run `npm install`
- [ ] Verify `.env.local` has correct API URL
- [ ] Run `npm run dev` - app starts on port 3000
- [ ] Browser opens to http://localhost:3000

---

## 🎯 Features Checklist

### Authentication ✅
- [ ] User can sign up with email/password
- [ ] Password validation (min 6 chars)
- [ ] Passwords match check
- [ ] User can login with credentials
- [ ] JWT token generated on signup/login
- [ ] Token stored in localStorage
- [ ] Token sent with all API requests
- [ ] User can logout
- [ ] Logout clears token
- [ ] Protected routes redirect to login

### User Management ✅
- [ ] Can view profile with name, email, bio, avatar
- [ ] Can edit profile (name, bio, avatar)
- [ ] Profile changes saved to database
- [ ] Profile persists after logout/login
- [ ] Navbar shows user name
- [ ] User data isolated (can't see others' data)

### Task Management ✅
- [ ] Can create task with title, description, priority
- [ ] Can set due date on task
- [ ] Can view all tasks in dashboard
- [ ] Task list displays with colors/badges
- [ ] Can change task status (pending → in-progress → completed)
- [ ] Status change updates immediately
- [ ] Can delete task with confirmation
- [ ] Delete removes from list
- [ ] All tasks linked to current user only

### Search & Filter ✅
- [ ] Search box filters tasks by title/description
- [ ] Search is real-time
- [ ] Can filter by status (all/pending/in-progress/completed)
- [ ] Can filter by priority (all/low/medium/high)
- [ ] Filters combine (AND logic)
- [ ] Can sort tasks by date
- [ ] Clear filters shows all tasks
- [ ] Filtered count accurate

### Dashboard ✅
- [ ] Shows stats: Total, Completed, In Progress, Pending
- [ ] Stats update when tasks change
- [ ] Task list displays all tasks
- [ ] Task cards show title, description, dates
- [ ] Priority badges color-coded
- [ ] Status buttons work
- [ ] Delete buttons work
- [ ] New Task button opens form

### Security ✅
- [ ] Passwords hashed with bcrypt (not plain text)
- [ ] JWT tokens validated on backend
- [ ] Protected endpoints require token
- [ ] User can only access own data
- [ ] Error messages don't expose internals
- [ ] No sensitive info in localStorage
- [ ] CORS enabled
- [ ] Input validation on all forms

### UI/UX ✅
- [ ] Forms are user-friendly
- [ ] Error messages clear
- [ ] Loading states show
- [ ] Colors professional
- [ ] TailwindCSS applied
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop responsive
- [ ] Navigation clear
- [ ] No broken links

---

## 📱 Responsive Design Checklist

### Mobile (375px width)
- [ ] Layout single column
- [ ] Text readable
- [ ] Buttons touch-friendly
- [ ] No horizontal scroll
- [ ] Form inputs full width
- [ ] Filters stack vertically
- [ ] Nav hamburger menu (if needed)

### Tablet (768px width)
- [ ] Layout adapts
- [ ] 2 column grid where appropriate
- [ ] All elements visible
- [ ] Touch targets adequate

### Desktop (1920px width)
- [ ] Full layout
- [ ] Proper spacing
- [ ] Multi-column layout
- [ ] No wasted space

---

## 🔐 Security Verification

### Password Security
- [ ] Check User.js uses bcryptjs
- [ ] Salt rounds = 10
- [ ] Password not logged/exposed
- [ ] Hashed password stored in DB

### JWT Security
- [ ] Token has SECRET
- [ ] Token verified on protected routes
- [ ] Token expires (or implement expiry)
- [ ] Invalid tokens rejected

### Data Protection
- [ ] Users only see own tasks
- [ ] Query filters by userId
- [ ] Can't access others' profiles
- [ ] Can't delete others' tasks

### Input Validation
- [ ] Client-side: HTML5 + React validation
- [ ] Server-side: Express validation
- [ ] Email format checked
- [ ] Password requirements enforced
- [ ] Required fields validated

---

## 📚 Documentation Checklist

- [ ] README.md created
- [ ] README has all sections:
  - [ ] Project overview
  - [ ] Features list
  - [ ] Setup instructions
  - [ ] API documentation
  - [ ] Database schema
  - [ ] Deployment guide
- [ ] QUICKSTART.md created
- [ ] DEPLOYMENT_SCALING.md created
- [ ] Postman collection created
- [ ] Code comments where needed
- [ ] Project structure documented

---

## 📊 API Documentation Checklist

### Auth Endpoints
- [ ] POST /signup documented
- [ ] POST /login documented
- [ ] Request format shown
- [ ] Response format shown
- [ ] Error responses documented

### Task Endpoints
- [ ] GET /tasks documented
- [ ] POST /tasks documented
- [ ] PUT /tasks/:id documented
- [ ] DELETE /tasks/:id documented
- [ ] Filter parameters shown
- [ ] Authorization requirement shown

### User Endpoints
- [ ] GET /profile documented
- [ ] PUT /profile documented
- [ ] Response format shown

---

## 🧪 Testing Checklist

### Basic Testing
- [ ] Can signup
- [ ] Can login
- [ ] Can create task
- [ ] Can read tasks
- [ ] Can update task
- [ ] Can delete task
- [ ] Can search
- [ ] Can filter
- [ ] Can logout

### Error Testing
- [ ] Wrong password fails
- [ ] Missing fields fail
- [ ] Invalid email fails
- [ ] Duplicate email fails
- [ ] Expired token fails
- [ ] Missing token fails

### Data Testing
- [ ] Data persists in DB
- [ ] Logout doesn't delete data
- [ ] Login shows saved data
- [ ] Multiple users isolated
- [ ] Filters work correctly

---

## 🐙 GitHub Checklist

- [ ] Initialize git repo: `git init`
- [ ] Add all files: `git add .`
- [ ] First commit: `git commit -m "Initial: Full-stack task manager"`
- [ ] Create GitHub repo
- [ ] Add remote: `git remote add origin <url>`
- [ ] Push to main: `git push -u origin main`
- [ ] README.md visible on GitHub
- [ ] All files visible
- [ ] Commit history clean
- [ ] .gitignore working (node_modules not included)

---

## 📦 Deliverables Checklist

### Frontend
- [ ] Next.js project
- [ ] All pages created
- [ ] All components created
- [ ] TailwindCSS applied
- [ ] Responsive design verified
- [ ] Protected routes working
- [ ] API client configured

### Backend
- [ ] Express server
- [ ] MongoDB connection
- [ ] All routes created
- [ ] JWT middleware
- [ ] Bcrypt password hashing
- [ ] Database models
- [ ] Error handling

### Documentation
- [ ] README.md complete
- [ ] QUICKSTART.md complete
- [ ] DEPLOYMENT_SCALING.md complete
- [ ] API Postman collection
- [ ] Code comments added

### Repository
- [ ] GitHub repo created
- [ ] All code pushed
- [ ] Clean commit history
- [ ] .gitignore configured
- [ ] README visible

---

## 🚀 Pre-Submission Checklist

### Code Quality
- [ ] No console.log statements left
- [ ] No commented-out code
- [ ] Consistent naming
- [ ] Proper indentation
- [ ] No eslint errors
- [ ] TypeScript types defined

### Functionality
- [ ] No broken features
- [ ] All CRUD works
- [ ] Search works
- [ ] Filters work
- [ ] Auth works
- [ ] Protected routes work

### Performance
- [ ] Pages load quickly
- [ ] No unnecessary API calls
- [ ] No memory leaks
- [ ] Responsive (no lag)

### Security
- [ ] No hardcoded secrets
- [ ] Passwords hashed
- [ ] JWT validated
- [ ] Input sanitized
- [ ] Errors safe

### Testing
- [ ] Tested all features locally
- [ ] All 20 tests pass (from TESTING_GUIDE.md)
- [ ] No known bugs
- [ ] Error cases handled

---

## 📝 Final Submission

### Files to Submit
- [ ] Complete `frontend/` folder
- [ ] Complete `backend/` folder
- [ ] All documentation files (.md)
- [ ] Postman collection (JSON)
- [ ] .gitignore files

### Submission Format
- [ ] Push to GitHub
- [ ] Create GitHub repo link
- [ ] Include repo link in submission
- [ ] Include setup instructions
- [ ] Include brief project description

### README for Reviewers
In submission, include:
- [ ] GitHub repo link
- [ ] How to setup (5 min)
- [ ] How to test (5 min)
- [ ] Key features implemented
- [ ] Scalability notes
- [ ] Additional features (if any)

---

## 🎯 Evaluation Criteria ✅

### ✅ UI/UX Quality
- [ ] Professional design
- [ ] Easy to use
- [ ] Responsive
- [ ] Color scheme good
- [ ] Typography clear

### ✅ Integration
- [ ] Frontend ↔ Backend works
- [ ] Data flows correctly
- [ ] Real-time updates
- [ ] No sync issues

### ✅ Security
- [ ] Passwords hashed
- [ ] JWT implemented
- [ ] Protected routes
- [ ] Error handling
- [ ] Input validation

### ✅ Code Quality
- [ ] Clean code
- [ ] Well documented
- [ ] Modular structure
- [ ] Reusable components
- [ ] Best practices

### ✅ Scalability
- [ ] Modular design
- [ ] Easy to add features
- [ ] Database ready for scale
- [ ] API ready for versioning
- [ ] Deployment guide included

---

## 🎉 Final Steps

1. **Review Everything**
   - [ ] Run both servers
   - [ ] Test all features
   - [ ] Check documentation
   - [ ] Verify responsive design

2. **Clean Up**
   - [ ] Remove console.logs
   - [ ] Delete temp files
   - [ ] Update .env.example
   - [ ] Write meaningful commits

3. **Push to GitHub**
   - [ ] Final git add
   - [ ] Final git commit
   - [ ] git push to main

4. **Prepare Submission**
   - [ ] Get repo link
   - [ ] Write brief summary
   - [ ] Prepare setup instructions
   - [ ] Test demo ready

5. **Submit**
   - [ ] Include GitHub link
   - [ ] Include setup guide
   - [ ] Include API docs link
   - [ ] Include deployment notes

---

## 📞 Help & Resources

- **Stuck on setup?** → See QUICKSTART.md
- **Stuck on features?** → See README.md
- **Stuck on testing?** → See TESTING_GUIDE.md
- **Stuck on deployment?** → See DEPLOYMENT_SCALING.md
- **Stuck on code?** → Check comments and examples

---

## ✅ All Done!

If you've checked all these boxes, your application is **ready for submission**. 

**Congratulations! 🎉**

You've built a complete full-stack web application with:
- Modern frontend (React/Next.js)
- Professional backend (Express)
- Database (MongoDB)
- Authentication & security
- Responsive design
- Complete documentation

This demonstrates strong engineering fundamentals. Good luck with your internship! 🚀

