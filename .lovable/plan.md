

## Problem

The admin login at `/AdMiN_loggin` fails with "Access Denied" even for the admin user. The root cause is a **race condition** in how the role is checked after login.

**What happens step by step:**

1. `signOut()` is called — clears the session
2. `useUserRole` hook reacts — sets `role = null`, `loading = false`
3. `signIn()` succeeds — but the Supabase client's internal session token updates asynchronously
4. `useUserRole` hook fires its role query **before** the JWT token is available
5. The query goes out with the **anon key** instead of the user's JWT
6. RLS policy blocks it — returns `[]` (empty)
7. Role stays `null` → useEffect fires with `loginAttempted=true`, `role=null` → shows "Access Denied"

**Evidence from network logs:** The `user_roles` query returned `[]` with the anon key in the authorization header, not the user's session JWT.

## Solution

Remove the fragile `useEffect`-based role checking and replace it with a **direct role query** inside `handleSubmit`, executed after sign-in completes and after explicitly fetching the fresh session.

### Files to Modify

**`src/pages/AdminLogin.tsx`**
- Import `supabase` client directly
- Remove the `useUserRole` hook and `loginAttempted` state
- Remove the `useEffect` for role-based redirect
- After `signIn()` succeeds, call `supabase.auth.getSession()` to get the fresh session
- Use that session's user ID to query `user_roles` directly
- If role is `admin`, navigate to `/platform`
- If not, show "Access Denied" toast and sign out

**`src/pages/ProtectorsLogin.tsx`**
- Apply the same fix: direct role query after sign-in instead of useEffect
- Check for `pentester`, `client`, or `admin` roles

### Technical Details

The key change is replacing:
```text
useEffect → watches role/user/loginAttempted → redirects
```
with:
```text
handleSubmit → signIn() → getSession() → query role directly → redirect or deny
```

This eliminates the race condition because:
1. `getSession()` waits for the session to be fully available
2. The query uses the authenticated session token
3. The redirect happens synchronously in the submit handler flow

No database or backend changes are needed.

