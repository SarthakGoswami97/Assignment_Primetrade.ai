# 🧪 Complete Testing Walkthrough

## Prerequisites
- Both backend and frontend servers running
- Browser open at http://localhost:3000

---

## Test 1: User Registration

### Steps
1. Click "Sign Up" link on login page
2. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPassword123`
   - Confirm Password: `TestPassword123`
3. Click "Sign Up" button

### Expected Result
✅ Account created  
✅ Redirected to dashboard  
✅ Token saved in localStorage  
✅ User info shows in navbar  

### Verify
- Check browser DevTools > Application > LocalStorage
- Should see `token` and `user` keys

---

## Test 2: User Login

### Steps
1. Click "Logout" (or go to /login)
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `TestPassword123`
3. Click "Login"

### Expected Result
✅ Login successful  
✅ Redirected to dashboard  
✅ Token refreshed  

---

## Test 3: Create Tasks

### Steps
1. On dashboard, click "+ New Task"
2. Fill form:
   - Title: `Complete FSD Assignment`
   - Description: `Build full-stack web app`
   - Priority: `High`
   - Due Date: `2026-01-15`
3. Click "Create Task"

### Expected Result
✅ Modal closes  
✅ Task appears in list  
✅ Statistics update (Total: 1)  
✅ Task shows with correct priority badge  

---

## Test 4: Create Multiple Tasks

### Create 3 tasks:

**Task 2**
- Title: `Review Documentation`
- Description: `Check all docs`
- Priority: `Medium`
- Due Date: `2026-01-12`

**Task 3**
- Title: `Deploy to Production`
- Description: `Deploy frontend and backend`
- Priority: `High`
- Due Date: `2026-01-20`

**Task 4**
- Title: `Write Tests`
- Description: `Unit and integration tests`
- Priority: `Low`
- Due Date: `2026-01-18`

### Expected Result
✅ All 4 tasks visible  
✅ Statistics: Total = 4, Pending = 4  
✅ Color-coded priorities visible  

---

## Test 5: Search Functionality

### Steps
1. In Search field, type: `FSD`
2. Press Enter or wait for auto-filter

### Expected Result
✅ Only tasks with "FSD" in title/description shown  
✅ Should show: "Complete FSD Assignment"  
✅ Others filtered out  

### Test 5b: Clear Search
1. Clear search field
2. Should show all tasks again

---

## Test 6: Filter by Status

### Steps
1. Click Status dropdown
2. Select: `Pending`

### Expected Result
✅ All 4 tasks shown (all pending)  
✅ Statistics update  

### Steps 2
1. Click any task's status dropdown
2. Select: `In Progress`

### Expected Result
✅ Task status changes immediately  
✅ Statistics update (Pending: 3, In Progress: 1)  

---

## Test 7: Filter by Priority

### Steps
1. Click Priority dropdown
2. Select: `High`

### Expected Result
✅ Only high priority tasks shown  
✅ Should show: 2 tasks (FSD, Deploy)  
✅ Other priorities hidden  

### Steps 2
1. Change Priority back to: `All Priority`
2. All tasks show again

---

## Test 8: Combined Filters

### Steps
1. Status = `In Progress`
2. Priority = `High`
3. Search = `Deploy`

### Expected Result
✅ Shows only tasks matching ALL criteria  
✅ Should show: "Deploy to Production" (if in-progress)  
✅ If no matches, show empty state  

---

## Test 9: Update Task Status

### Steps
1. Click status dropdown on "Complete FSD Assignment"
2. Select: `Completed`

### Expected Result
✅ Status changes to green "Completed"  
✅ Statistics update (Completed: 1)  
✅ Task moves if filtering by status  

### Test More Statuses
1. Change to: `In Progress` (blue)
2. Change to: `Pending` (gray)
3. Back to: `Completed` (green)

---

## Test 10: Delete Task

### Steps
1. Find "Write Tests" task
2. Click "Delete" button

### Expected Result
✅ Confirmation dialog appears  
✅ After confirm: task removed  
✅ Statistics update (Total: 3)  
✅ If it was high priority: only 1 high priority remains  

---

## Test 11: Edit Profile

### Steps
1. Click your name in navbar
2. Navigated to `/profile`
3. Click "Edit Profile"

### Expected Result
✅ Form becomes editable  
✅ Can update Name, Bio, Avatar  

### Steps 2
1. Update:
   - Name: `Test User Updated`
   - Bio: `This is my bio. I love coding!`
   - Avatar: `https://via.placeholder.com/150`
2. Click "Save Changes"

### Expected Result
✅ Profile updated  
✅ Success message appears  
✅ Changes persist (refresh page)  
✅ Name updated in navbar  

---

## Test 12: Responsive Design

### Desktop (1920px)
1. All elements visible
2. Grid shows full width
3. Navbar properly spaced

### Tablet (768px)
1. Click browser menu (DevTools)
2. Select iPad or similar
3. Verify:
   - ✅ Navigation wraps properly
   - ✅ Tasks display in 1-2 columns
   - ✅ Forms readable
   - ✅ Buttons clickable

### Mobile (375px)
1. Select iPhone from DevTools
2. Verify:
   - ✅ Single column layout
   - ✅ Font sizes readable
   - ✅ Buttons large enough
   - ✅ No horizontal scroll
   - ✅ Filters stack vertically

---

## Test 13: Logout

### Steps
1. Click "Logout" button in navbar

### Expected Result
✅ Token cleared from localStorage  
✅ Redirected to `/login`  
✅ Cannot access dashboard (protected route)  

### Verify Protection
1. Try to access `/dashboard` directly
2. Should redirect to `/login`

---

## Test 14: Protected Routes

### Steps
1. Logout
2. Try to access `/dashboard` via URL bar
3. Type: `http://localhost:3000/dashboard`

### Expected Result
✅ Redirected to `/login`  
✅ Cannot see dashboard content  

### Steps 2
1. Login again
2. Access `/dashboard`

### Expected Result
✅ Dashboard loads  
✅ All tasks visible  

---

## Test 15: API Errors

### Steps (Use Postman or browser console)
1. Try to create task without token
2. Make request to: `GET /api/tasks`
3. Without Authorization header

### Expected Result
✅ Error: `401 - No token provided`  
✅ Status code: 401  

### Steps 2
1. Try to login with wrong password
2. Email: `test@example.com`
3. Password: `WrongPassword`

### Expected Result
✅ Error: `Invalid email or password`  
✅ No token generated  

---

## Test 16: Validation

### Client-side Validation
1. Try to signup with:
   - Empty fields → Error messages
   - Non-matching passwords → Error
   - Password < 6 chars → Error (if applicable)
   - Invalid email → Error

2. Try to create task:
   - Empty title → Cannot submit
   - Clear form → Resets

### Expected Result
✅ Form prevents invalid submission  
✅ Error messages helpful  

---

## Test 17: Data Persistence

### Steps
1. Create 2 tasks
2. Logout
3. Login again
4. Go to dashboard

### Expected Result
✅ All tasks still there  
✅ Data persisted in MongoDB  
✅ User profile updated correctly  

---

## Test 18: Error Handling

### Try these errors:

1. **Network Error**
   - Turn off backend server
   - Try to load dashboard
   - Should show error message

2. **Invalid JWT**
   - Manually edit localStorage token
   - Refresh page
   - Should redirect to login

3. **Database Error**
   - Disconnect MongoDB
   - Try to create task
   - Should show error message

---

## Test 19: Performance

### Metrics
1. Open DevTools > Performance
2. Measure:
   - ✅ Signup page load < 2s
   - ✅ Dashboard load < 2s
   - ✅ Task creation < 1s
   - ✅ Filters apply instantly

3. Check DevTools > Network
   - ✅ API requests < 200ms
   - ✅ Token properly sent
   - ✅ CORS headers present

---

## Test 20: Final Verification

### Checklist
- [ ] Signup works
- [ ] Login works
- [ ] Create task works
- [ ] Update task works
- [ ] Delete task works
- [ ] Search works
- [ ] Filters work
- [ ] Profile edit works
- [ ] Logout works
- [ ] Protected routes work
- [ ] Responsive design works
- [ ] Error handling works
- [ ] Data persists
- [ ] Security working (JWT, bcrypt)
- [ ] API documentation accurate

### If All Pass ✅
**Your application is ready for submission!**

---

## 📊 Test Coverage Summary

| Feature | Test | Status |
|---------|------|--------|
| Authentication | T1, T2, T13-14 | ✅ |
| CRUD Tasks | T3-4, T5-9 | ✅ |
| Search & Filter | T5-8 | ✅ |
| Profile Mgmt | T11 | ✅ |
| Security | T15, T18 | ✅ |
| Responsiveness | T12 | ✅ |
| Error Handling | T15, T18 | ✅ |
| Data Persistence | T17 | ✅ |
| Performance | T19 | ✅ |

---

## 🎯 Expected vs Actual

If all tests pass, your actual results should match:

```
✅ UI loads instantly
✅ Authentication works smoothly
✅ CRUD operations complete < 1s
✅ Filters apply instantly
✅ Responsive on all devices
✅ No console errors
✅ No security warnings
✅ Data persists correctly
```

---

## 🐛 Troubleshooting During Tests

| Issue | Solution |
|-------|----------|
| Tasks not loading | Check backend is running |
| Cannot create task | Verify token in localStorage |
| Search not working | Check MongoDB indexing |
| Page not responsive | Check viewport in DevTools |
| Filters not applying | Refresh page |
| Cannot login | Verify MongoDB has user |
| Task status not updating | Check backend response |
| Redirects not working | Check localStorage |

---

## ✅ READY FOR TESTING!

All 20 tests should pass before submission. Good luck! 🚀

