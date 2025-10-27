# Testing Guide for FileMint Authentication System

## Prerequisites
- MongoDB is running and accessible
- `.env` file is configured with `MONGODB_URI` and `JWT_SECRET`
- Development server is running (`npm run dev`)

## Test Scenarios

### 1. User Registration (Signup)

**Steps:**
1. Navigate to `http://localhost:3000/signup`
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Password: `password123`
   - Check "I agree to Terms & Conditions"
3. Click "Sign Up"

**Expected Results:**
- ✅ Form validates all fields
- ✅ Password must be at least 8 characters
- ✅ Terms must be accepted
- ✅ Upon success, automatically logged in
- ✅ Redirected to `/settings` page
- ✅ User information displayed in sidebar
- ✅ Success message shown (if configured)

**Error Cases to Test:**
- Password less than 8 characters → Error message
- Email already exists → "User already exists" error
- Terms not accepted → Cannot submit
- Empty fields → "All fields required" error

---

### 2. User Login

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `john.doe@example.com`
   - Password: `password123`
3. Click "Log In"

**Expected Results:**
- ✅ Form validates email and password
- ✅ Upon success, redirected to `/settings`
- ✅ User information loaded and displayed
- ✅ Token stored in localStorage

**Error Cases to Test:**
- Wrong email → "Invalid email or password"
- Wrong password → "Invalid email or password"
- Empty fields → Cannot submit

---

### 3. View Profile

**Steps:**
1. Ensure you're logged in
2. Navigate to `http://localhost:3000/profile`

**Expected Results:**
- ✅ Profile page displays user information
- ✅ Avatar shows user initials (e.g., "JD")
- ✅ First name, last name, and email displayed
- ✅ "Edit Profile" button works
- ✅ "Logout" button works
- ✅ Quick action cards are clickable
- ✅ Account status shows "Active"

**Unauthenticated Test:**
- Logout first
- Try to access `/profile` directly
- ✅ Should redirect to `/login`

---

### 4. Edit Profile Information

**Steps:**
1. Go to `http://localhost:3000/settings`
2. Ensure "Account" tab is selected
3. Modify first name to `Jane`
4. Modify last name to `Smith`
5. Click "Save Changes"

**Expected Results:**
- ✅ Success message: "Account updated successfully!"
- ✅ Changes reflected in sidebar immediately
- ✅ Changes persist after page refresh
- ✅ Email remains unchanged (displayed only)

**Error Cases to Test:**
- Empty first name → Cannot submit
- Empty last name → Cannot submit
- Network error → Error message displayed

---

### 5. Change Password

**Steps:**
1. Go to `http://localhost:3000/settings`
2. Scroll to "Change Password" section
3. Enter:
   - Current Password: `password123`
   - New Password: `newpassword123`
   - Repeat Password: `newpassword123`
4. Click "Save Changes"

**Expected Results:**
- ✅ Success message: "Password updated successfully!"
- ✅ Form fields cleared after success
- ✅ Can login with new password

**Error Cases to Test:**
- Wrong current password → "Current password is incorrect"
- New password < 8 characters → Error message
- Passwords don't match → "Passwords do not match"
- Empty fields → Cannot submit

---

### 6. Navigation Between Tabs

**Steps:**
1. Go to `http://localhost:3000/settings`
2. Click "Subscription" tab
3. Click "Settings" tab
4. Click "Account" tab

**Expected Results:**
- ✅ Tabs switch correctly
- ✅ Content changes for each tab
- ✅ Active tab highlighted
- ✅ No console errors

---

### 7. Logout Functionality

**Steps:**
1. Ensure you're logged in
2. Go to `/settings` or `/profile`
3. Click "Log Out" button

**Expected Results:**
- ✅ Redirected to `/login` page
- ✅ Token removed from localStorage
- ✅ User state cleared
- ✅ Cannot access protected routes anymore
- ✅ Attempting to access `/settings` redirects to `/login`

---

### 8. Session Persistence

**Steps:**
1. Login to the application
2. Navigate to `/settings`
3. Close the browser tab
4. Open a new tab and go to `http://localhost:3000/settings`

**Expected Results:**
- ✅ Still logged in
- ✅ User data displayed
- ✅ No need to login again
- ✅ Token still in localStorage

---

### 9. Protected Routes

**Steps:**
1. Logout (or start without logging in)
2. Try to directly access:
   - `http://localhost:3000/settings`
   - `http://localhost:3000/profile`

**Expected Results:**
- ✅ Redirected to `/login` page
- ✅ Cannot access content without authentication
- ✅ After login, can access these pages

---

### 10. Form Validation

**Signup Page:**
- ✅ First name required
- ✅ Last name required
- ✅ Valid email format required
- ✅ Password min 8 characters
- ✅ Terms must be accepted

**Login Page:**
- ✅ Email required
- ✅ Password required
- ✅ Valid email format

**Settings - Account:**
- ✅ First name required
- ✅ Last name required

**Settings - Password:**
- ✅ All password fields required
- ✅ New password min 8 characters
- ✅ Passwords must match

---

## Database Verification

### Check MongoDB

**Using MongoDB Compass or CLI:**
1. Connect to your MongoDB database
2. Navigate to your database
3. Check the `users` collection

**Verify:**
- ✅ User document created with correct fields
- ✅ Password is hashed (not plain text)
- ✅ Email is unique
- ✅ `createdAt` and `updatedAt` timestamps exist
- ✅ After update, `updatedAt` changes

---

## API Testing (Optional)

### Using Postman or cURL

**1. Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "termsAccepted": true
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**3. Get Profile:**
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**4. Update Profile:**
```bash
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

---

## Browser Developer Tools Checks

### Console
- ✅ No error messages during normal flow
- ✅ API calls succeed (200 status codes)
- ✅ No CORS errors

### Network Tab
- ✅ POST /api/auth/signup returns 201
- ✅ POST /api/auth/login returns 200 with token
- ✅ GET /api/user/profile returns 200 with user data
- ✅ PUT /api/user/profile returns 200 on success

### Application Tab (LocalStorage)
- ✅ `token` key exists after login
- ✅ `token` is removed after logout
- ✅ Token is a valid JWT format (3 parts separated by dots)

---

## Edge Cases to Test

1. **Multiple Signups with Same Email:**
   - Try to sign up twice with the same email
   - ✅ Second attempt should fail with appropriate error

2. **Token Expiration:**
   - Wait for 7 days (or modify token expiration to 1 minute for testing)
   - ✅ Expired token should redirect to login

3. **Browser Refresh:**
   - Login and navigate to settings
   - Refresh the page
   - ✅ Should remain logged in

4. **Multiple Browser Tabs:**
   - Login in one tab
   - Open another tab
   - ✅ Both tabs should have access to authenticated routes

5. **Password Visibility Toggle:**
   - In password change form, click eye icons
   - ✅ Password should toggle between visible and hidden

---

## Performance Checks

- ✅ Login response time < 1 second
- ✅ Profile page loads quickly
- ✅ No memory leaks (check with React DevTools)
- ✅ MongoDB queries are optimized

---

## Security Checks

- ✅ Passwords are hashed in database
- ✅ JWT tokens contain user ID but not sensitive data
- ✅ Token is required for protected routes
- ✅ Invalid tokens are rejected
- ✅ Current password required to change password

---

## Common Issues and Solutions

### Issue: "MongoDB connection error"
**Solution:** 
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running
- Check network connectivity

### Issue: "JWT_SECRET is not defined"
**Solution:**
- Add `JWT_SECRET` to `.env` file
- Restart dev server

### Issue: Page doesn't redirect after login
**Solution:**
- Check browser console for errors
- Verify token is stored in localStorage
- Check AuthContext is properly configured

### Issue: Changes not persisting
**Solution:**
- Check MongoDB connection
- Verify API calls are successful in Network tab
- Check for server-side errors in terminal

---

## Success Criteria

✅ All test scenarios pass
✅ No console errors
✅ No TypeScript errors
✅ Database updates correctly
✅ UI responds appropriately
✅ Error messages are user-friendly
✅ Loading states work
✅ Session persists correctly
✅ Protected routes are secure

---

**Testing Complete!** If all tests pass, the authentication system is ready for production.
