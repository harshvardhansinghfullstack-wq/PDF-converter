# FileMint Authentication System

## Overview
This project now includes a complete authentication system using MongoDB, JWT tokens, and React Context API.

## Features Implemented

### 1. **User Authentication**
- ✅ Signup with validation (First Name, Last Name, Email, Password)
- ✅ Login with email and password
- ✅ JWT token-based authentication
- ✅ Secure password hashing using bcryptjs
- ✅ Token stored in localStorage with 7-day expiration

### 2. **User Profile Management**
- ✅ View user profile information
- ✅ Edit first name and last name
- ✅ Change password with current password verification
- ✅ Beautiful profile page with user initials avatar

### 3. **Settings Page**
- ✅ Account tab - Edit profile information
- ✅ Change password functionality
- ✅ Subscription information
- ✅ Preferences and settings
- ✅ Logout functionality

### 4. **Protected Routes**
- ✅ Settings page requires authentication
- ✅ Profile page requires authentication
- ✅ Automatic redirect to login if not authenticated

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts          # Login API endpoint
│   │   │   └── signup/route.ts         # Signup API endpoint
│   │   └── user/
│   │       └── profile/route.ts        # User profile GET/PUT endpoints
│   ├── context/
│   │   └── AuthContext.tsx             # Authentication context provider
│   ├── models/
│   │   └── user.ts                     # MongoDB User model with password hashing
│   ├── routes/
│   │   └── mongo.ts                    # MongoDB connection utility
│   ├── login/
│   │   └── page.tsx                    # Login page
│   ├── signup/
│   │   └── page.tsx                    # Signup page
│   ├── settings/
│   │   └── page.tsx                    # Settings page (protected)
│   ├── profile/
│   │   └── page.tsx                    # Profile page (protected)
│   └── layout.tsx                      # Root layout with AuthProvider
├── middleware.ts                        # Route protection middleware
└── .env                                 # Environment variables

```

## Environment Variables

Add these to your `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## API Endpoints

### Authentication

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "termsAccepted": true
}
```

**Response:**
```json
{
  "message": "User created successfully"
}
```

#### POST `/api/auth/login`
Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

### User Profile

#### GET `/api/user/profile`
Get current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

#### PUT `/api/user/profile`
Update user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body (Update Name):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

**Request Body (Change Password):**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

## Using the Authentication System

### 1. Signup
1. Navigate to `/signup`
2. Fill in first name, last name, email, and password (min 8 characters)
3. Accept terms and conditions
4. Click "Sign Up"
5. You'll be automatically logged in and redirected to settings page

### 2. Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Log In"
4. You'll be redirected to settings page

### 3. View Profile
1. After logging in, navigate to `/profile`
2. View your profile information
3. Click "Edit Profile" to go to settings

### 4. Edit Profile
1. Navigate to `/settings`
2. In the Account tab:
   - Update first name and last name
   - Click "Save Changes"
3. To change password:
   - Enter current password
   - Enter new password (min 8 characters)
   - Repeat new password
   - Click "Save Changes"

### 5. Logout
1. Click the "Log Out" button in the sidebar
2. You'll be redirected to login page
3. Your session token will be cleared

## Using Auth Context in Components

```tsx
import { useAuth } from "@/app/context/AuthContext";

function MyComponent() {
  const { user, token, login, signup, logout, updateUser, isLoading } = useAuth();

  // Check if user is logged in
  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs with 10 salt rounds
2. **JWT Tokens**: Secure token-based authentication with 7-day expiration
3. **Protected Routes**: Authentication required for sensitive pages
4. **Password Validation**: Minimum 8 characters required
5. **MongoDB Connection**: Secure connection with timeout settings

## Database Schema

### User Model
```typescript
{
  firstName: String (required)
  lastName: String (required)
  email: String (required, unique)
  password: String (required, hashed)
  termsAccepted: Boolean (required)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

## Troubleshooting

### "MongoDB connection error"
- Check your `MONGODB_URI` in `.env` file
- Ensure your MongoDB cluster is running
- Check network connectivity

### "JWT_SECRET is not defined"
- Add `JWT_SECRET` to your `.env` file
- Restart your development server

### "User not found" or "Invalid credentials"
- Verify the email and password are correct
- Make sure you've signed up first

### Session expires too quickly
- Adjust token expiration in `/api/auth/login/route.ts`
- Change `expiresIn: "7d"` to your preferred duration

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Future Enhancements

- [ ] Email verification
- [ ] Password reset via email
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Session management dashboard
- [ ] Account deletion functionality
- [ ] Profile picture upload
- [ ] Email notification preferences

## Support

For issues or questions, please create an issue in the repository.
