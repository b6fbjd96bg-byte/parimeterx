

## Problem

Currently, the admin panel (`/platform`) and employee/pentester panel are accessible to any authenticated user. The Navbar shows "Platform" and "Dashboard" links to everyone who is logged in. There are no separate, hidden login routes for admin vs employees.

The user wants:
1. A hidden admin login page at `/AdMiN_loggin` -- only admins use this to access the admin panel
2. A hidden employee login page at `/prOtectors` -- only employees (pentesters/clients) created by admin can log in here
3. These login pages should NOT be linked from the main site navigation
4. The "Platform" and "Dashboard" buttons should be removed from the public Navbar entirely
5. Admin creates employee credentials via the Users page; employees use those credentials at `/prOtectors`

## Plan

### 1. Create Admin Login Page (`src/pages/AdminLogin.tsx`)

- New page at route `/AdMiN_loggin`
- Login-only form (no signup) with a distinct admin branding
- On successful login, check the user's role via `useUserRole`
- If role is `admin`, redirect to `/platform`
- If role is NOT `admin`, show "Access Denied" and sign out immediately
- Styled differently from the main auth page to distinguish it

### 2. Create Employee Login Page (`src/pages/ProtectorsLogin.tsx`)

- New page at route `/prOtectors`
- Login-only form (no signup) -- employees cannot self-register
- On successful login, check the user's role via `useUserRole`
- If role is `pentester` or `client`, redirect to `/platform`
- If role is `admin`, redirect to `/platform` (admins can use either)
- If no role, show "Access Pending" message
- Branded as "Protectors Portal" or similar

### 3. Update Navbar (`src/components/Navbar.tsx`)

- Remove "Platform" and "Dashboard" buttons entirely for all users
- The Navbar will only show: Services, About, Why Us, Contact, Login (public `/auth`), Get Security Audit
- Admin and employee panels are only accessible via their hidden URLs
- Keep the public `/auth` page for general users (contact form submitters, etc.) but remove signup if desired, or keep it as-is

### 4. Update Routes (`src/App.tsx`)

- Add route `/AdMiN_loggin` -> `AdminLogin` component
- Add route `/prOtectors` -> `ProtectorsLogin` component
- Wrap `/platform` routes with `RoleGuard` allowing `['admin', 'pentester', 'client']`
- Wrap admin-only routes (`/platform/users`, `/platform/invitations`, `/platform/audit-logs`) with `RoleGuard` allowing `['admin']`
- Wrap `/dashboard` routes with `RoleGuard` allowing `['admin']`

### 5. Update Auth Page (`src/pages/Auth.tsx`)

- On successful login, redirect based on role:
  - If `admin` -> `/platform`
  - If `pentester`/`client` -> `/platform`
  - If no role -> `/dashboard` (general scanner dashboard for public users)
- This provides a fallback but the hidden routes are the primary entry points

### Files to Create
- `src/pages/AdminLogin.tsx` -- admin-only login at `/AdMiN_loggin`
- `src/pages/ProtectorsLogin.tsx` -- employee-only login at `/prOtectors`

### Files to Modify
- `src/App.tsx` -- add new routes, wrap platform/dashboard routes with RoleGuard
- `src/components/Navbar.tsx` -- remove Platform/Dashboard buttons from nav

### Technical Details

- Role checking uses the existing `useUserRole` hook which queries `user_roles` table server-side via RLS
- No hardcoded credentials in code; authentication uses the existing auth system
- The hidden URLs act as obscurity-based access points; actual security is enforced by RoleGuard and RLS policies
- Admin creates employees via the existing manage-users edge function from `/platform/users`
- No database changes needed -- all infrastructure already exists

