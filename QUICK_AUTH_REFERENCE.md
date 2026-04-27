# Quick Reference: Firebase Token Authentication

## The Problem You Had

```
Error: "Failed to load resource: the server responded with a status of 400"
```

**Root Cause:** API calls were missing the Firebase authentication token in the `Authorization` header.

---

## The Solution

### Step 1: Use the `useAuth` Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { getToken, user } = useAuth();
  // Now you have access to getToken()
};
```

### Step 2: Get the Token Before API Calls

```typescript
const token = await getToken();
```

### Step 3: Attach Token to Requests

**Option A: Using the new API Client (Recommended)**

```typescript
import { apiPost, apiGet, apiDelete } from '@/lib/apiClient';

// POST request
const response = await apiPost('/api/chat', getToken, { 
  messages: [] 
});

// GET request
const response = await apiGet('/api/datasets', getToken);

// DELETE request
const response = await apiDelete(`/api/datasets/${id}`, getToken);

// File upload
import { apiUpload } from '@/lib/apiClient';
const response = await apiUpload('/api/user/profile-image', getToken, file);
```

**Option B: Manual Token Attachment**

```typescript
const token = await getToken();
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ← Add this line
  },
  body: JSON.stringify({ messages: [] })
});
```

---

## Where Token Is Required

### ✅ Protected Endpoints (Require Token)

- `POST /api/chat` — AI chat
- `POST /api/chat/stream` — Streaming chat
- `POST /api/upload` — File upload
- `POST /api/user/profile-image` — Profile image upload
- `GET /api/dashboard/summary` — Dashboard data
- `POST /api/history` — Save analysis
- `DELETE /api/history/:id` — Delete history
- `DELETE /api/datasets/:id` — Delete dataset
- `GET /api/settings` — Get user settings
- `POST /api/settings` — Update settings

### ✅ Public Endpoints (Token Optional)

- `GET /api/datasets` — List datasets
- `GET /api/history` — List history
- `GET /api/health` — Health check

---

## Common Patterns

### Protected Component

```typescript
import { useAuth } from '@/hooks/useAuth';
import { apiGet } from '@/lib/apiClient';

export const ProtectedComponent = () => {
  const { status, getToken } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (status === 'active') {
      loadData();
    }
  }, [status]);

  const loadData = async () => {
    const res = await apiGet('/api/dashboard/summary', getToken);
    if (res.ok) setData(res.data);
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status !== 'active') return <p>Please log in</p>;
  
  return <div>{/* render data */}</div>;
};
```

### Error Handling

```typescript
const response = await apiPost('/api/chat', getToken, data);

if (response.ok) {
  console.log('Success:', response.data);
} else if (response.status === 401) {
  console.log('Token invalid - user needs to re-login');
} else if (response.status === 403) {
  console.log('Permission denied');
} else {
  console.log('Error:', response.error);
}
```

---

## API Client Functions

### `apiRequest(url, getToken, options)`
Generic request function (use specific methods below)

### `apiGet(url, getToken, options?)`
GET request

### `apiPost(url, getToken, body?, options?)`
POST request with JSON body

### `apiPut(url, getToken, body?, options?)`
PUT request with JSON body

### `apiDelete(url, getToken, options?)`
DELETE request

### `apiUpload(url, getToken, file, fieldName?, additionalData?)`
File upload with FormData

**Response Object:**
```typescript
{
  ok: boolean;           // Success status
  status: number;        // HTTP status code
  data?: any;           // Response data
  error?: string;       // Error message if !ok
}
```

---

## Debug Checklist

- [ ] Are you inside a component that uses `useAuth`?
- [ ] Are you calling `getToken()` before making the request?
- [ ] Is the token passed in the `Authorization` header as `Bearer ${token}`?
- [ ] Is the endpoint in the "Protected Endpoints" list?
- [ ] Are you checking `status === 'active'` before making requests?
- [ ] Is the request being made after authentication is complete?

---

## Testing Your Token

In your browser console:

```javascript
// Get current token
const token = await auth.currentUser?.getIdToken();
console.log('Token:', token?.substring(0, 50) + '...');

// Copy and use in curl
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Related Files

- `src/lib/apiClient.ts` — API client utilities
- `src/hooks/useAuth.tsx` — Auth hook with getToken()
- `src/lib/firebase.ts` — Firebase configuration
- `src/components/auth/AuthModal.tsx` — Login/signup UI
- `AUTH_SETUP.md` — Detailed setup guide

