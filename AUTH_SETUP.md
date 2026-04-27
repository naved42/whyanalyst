# Firebase Authentication Setup Guide

## Overview

This application uses Firebase Authentication to manage user identity and access control. The backend Express server requires valid Firebase ID tokens for all protected API endpoints.

---

## Architecture

### Flow Diagram

```
User Login → Firebase Auth → Firebase ID Token → API Requests (with Bearer token)
    ↓
localStorage (Firebase token cached)
    ↓
useAuth Hook (provides getToken() function)
    ↓
API Client (apiRequest, apiPost, etc.)
    ↓
Express Server (verifyAuth middleware checks token)
    ↓
Protected Resources
```

---

## 1. Frontend Setup

### useAuth Hook

The `useAuth` hook provides all authentication-related functions and state:

```typescript
import { useAuth } from '../hooks/useAuth';

export const MyComponent = () => {
  const { 
    user,              // Current Firebase User object
    loading,           // Auth state loading
    isSignedIn,        // Boolean: is user logged in?
    isEmailVerified,   // Boolean: email verified?
    isAdmin,           // Boolean: admin user?
    getToken,          // Async function: returns Firebase ID token
    signOut,           // Async function: logs out user
    refreshUser,       // Async function: refresh user data
    status             // 'active' | 'loading' | 'unauthenticated' | 'unverified'
  } = useAuth();

  return (
    <>
      {isSignedIn ? (
        <p>Welcome, {user?.email}</p>
      ) : (
        <p>Please log in</p>
      )}
    </>
  );
};
```

### Firebase Config

Located at `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();
```

---

## 2. Making Authenticated API Requests

### Option A: Using the API Client Utility (Recommended)

The new `src/lib/apiClient.ts` provides convenient functions with automatic token handling:

#### POST Request

```typescript
import { useAuth } from '../hooks/useAuth';
import { apiPost, apiGet, apiDelete } from '../lib/apiClient';

export const MyComponent = () => {
  const { getToken } = useAuth();

  const handleAnalysis = async () => {
    const response = await apiPost(
      '/api/chat',
      getToken,
      {
        messages: [{ role: 'user', content: 'Analyze this data...' }],
        agent: 'data-analyst'
      }
    );

    if (response.ok) {
      console.log('Response:', response.data);
    } else {
      console.error('Error:', response.error);
    }
  };

  return <button onClick={handleAnalysis}>Analyze</button>;
};
```

#### GET Request

```typescript
const response = await apiGet(
  '/api/dashboard/summary',
  getToken
);

if (response.ok) {
  console.log('Summary:', response.data);
}
```

#### DELETE Request

```typescript
const response = await apiDelete(
  `/api/datasets/${datasetId}`,
  getToken
);

if (response.ok) {
  console.log('Dataset deleted');
}
```

#### File Upload

```typescript
import { apiUpload } from '../lib/apiClient';

const handleUpload = async (file: File) => {
  const response = await apiUpload(
    '/api/user/profile-image',
    getToken,
    file,
    'image'  // form field name
  );

  if (response.ok) {
    console.log('Upload successful:', response.data.url);
  }
};
```

### Option B: Manual Token Handling

For more control, manually get and attach the token:

```typescript
const { getToken } = useAuth();

const fetchData = async () => {
  const token = await getToken();
  
  if (!token) {
    console.error('Not authenticated');
    return;
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Hello' }]
    })
  });

  const data = await response.json();
  console.log(data);
};
```

---

## 3. Backend Setup

### Auth Middleware

The Express server validates Firebase tokens via middleware:

```typescript
// src/server.ts
const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    req.userId = decodedToken.uid;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
```

### Protected Endpoints

All endpoints with `verifyAuth` middleware require valid tokens:

```typescript
// Protected endpoint
app.post("/api/chat", verifyAuth, async (req, res) => {
  const userId = req.userId;  // From verified token
  // Process request...
});

// Public endpoint
app.get("/api/datasets", (req, res) => {
  // No token required
});
```

---

## 4. Authentication Flow

### Login Flow

```typescript
import { AuthModal } from '@/components/auth/AuthModal';

export const App = () => {
  const { isSignedIn, status } = useAuth();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return <AuthModal />;
  }

  if (status === 'unverified') {
    return <VerificationScreen />;
  }

  return <Workspace />;
};
```

### Email Verification

New email/password signups require email verification:

1. User signs up → Firebase sends verification email
2. User clicks link in email → Email marked as verified
3. `isEmailVerified` becomes true
4. User can now access the app

---

## 5. Common Patterns

### Protected Component

```typescript
import { useAuth } from '../hooks/useAuth';
import { apiGet } from '../lib/apiClient';

export const AdminDashboard = () => {
  const { isAdmin, getToken, loading } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isAdmin && !loading) {
      fetchAdminData();
    }
  }, [isAdmin, loading]);

  const fetchAdminData = async () => {
    const response = await apiGet('/api/admin/stats', getToken);
    if (response.ok) {
      setData(response.data);
    }
  };

  if (!isAdmin) {
    return <p>Not authorized</p>;
  }

  return <div>{/* render data */}</div>;
};
```

### Error Handling

```typescript
const handleRequest = async () => {
  const response = await apiPost(
    '/api/analyze',
    getToken,
    { data: 'value' }
  );

  if (response.ok) {
    toast.success('Success');
  } else if (response.status === 401) {
    toast.error('Please log in again');
    // Optional: trigger re-authentication
  } else if (response.status === 403) {
    toast.error('You do not have permission');
  } else {
    toast.error(response.error || 'Request failed');
  }
};
```

### Token Refresh

Tokens are automatically refreshed by Firebase when needed:

```typescript
const getToken = async () => {
  if (!user) return null;
  // Firebase automatically refreshes if expired
  return await getIdToken(user);
};
```

---

## 6. Debugging

### Check if Token is Present

```typescript
const { getToken, user } = useAuth();

const debugAuth = async () => {
  console.log('User:', user);
  console.log('Email verified:', user?.emailVerified);
  
  const token = await getToken();
  console.log('Token exists:', !!token);
  console.log('Token preview:', token?.substring(0, 20) + '...');
};
```

### Inspect Server Logs

The server logs all auth-related errors:

```
Firebase auth error: Invalid identity token
Email auth error: auth/email-already-in-use Firebase: Error
```

### Test Endpoint Manually

```bash
# Get a token first (from console with getToken())
TOKEN="eyJ..."

# Test protected endpoint
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7. Common Issues

### Error: "Failed to load resource: 400"

**Cause:** Missing or invalid authorization header
**Fix:** Ensure `getToken()` returns a valid token before making the request

```typescript
// ❌ Wrong
const response = await fetch('/api/chat', { method: 'POST' });

// ✅ Correct
const token = await getToken();
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Error: "auth/email-already-in-use"

**Cause:** Signing up with an email that already exists
**Fix:** Switch to login mode or use a different email

---

## 8. Environment Variables

Ensure these are set in `.env.local`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## 9. Testing

### Mock getToken for Tests

```typescript
import { render, screen } from '@testing-library/react';

const mockGetToken = jest.fn().mockResolvedValue('test-token');

const MockAuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ getToken: mockGetToken }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## Summary

1. **Always use `useAuth()`** to access `getToken()`
2. **Use `apiPost`, `apiGet`, etc.** for cleaner code
3. **Attach Bearer token** to all authenticated requests
4. **Handle 401 responses** (re-authenticate)
5. **Check `isEmailVerified`** before full access

For questions, check the Firebase docs: https://firebase.google.com/docs/auth

