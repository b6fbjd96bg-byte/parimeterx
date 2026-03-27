

## Plan: Three Changes

### 1. Show Security Audit Submissions in Admin Panel

**What:** Add a new section/page in the admin dashboard to display `contact_submissions` entries (which include security audit form submissions).

**How:**
- Create a new page `src/pages/dashboard/LeadsPage.tsx` that fetches from `contact_submissions` table and displays them in a table (name, email, company, service interest, date)
- Add a route `/dashboard/leads` in `App.tsx` guarded by admin role
- Add a "Leads / Submissions" link in `DashboardSidebar.tsx`
- No database changes needed — the table and RLS policies already exist

### 2. Reduce Hero Text on Service Pages

**What:** The `DetailedServicePageLayout` hero section currently shows `tagline`, `description`, AND `extendedDescription` — too much text. Trim it down.

**How:**
- In `DetailedServicePageLayout.tsx`, remove the `extendedDescription` paragraph from the hero section (keep the prop for potential use elsewhere, just don't render it in the hero)
- Shorten the `tagline` and `description` props across all 9 service page files (`ApplicationPentest.tsx`, `EnterprisePentest.tsx`, `RedTeamAssessment.tsx`, `CloudPentest.tsx`, `NetworkPentest.tsx`, `SourceCodeAudit.tsx`, `IoTPentest.tsx`, `AISecurityAssessment.tsx`, `BlockchainSecurity.tsx`) to concise 1-line versions

### 3. Public User Registration (No Admin Approval)

**What:** The `/auth` page already has signup functionality. Currently it works with Supabase Auth. The issue is email confirmation may be blocking immediate access.

**How:**
- Enable auto-confirm for email signups using the auth configuration tool so new users can register and sign in immediately without admin action
- The `/auth` page already has login + signup forms — no UI changes needed
- After signup, users get a basic authenticated session (no platform role assigned, so they won't access admin/platform routes)

### Super Admin Credentials

Already configured:
- **URL:** `/AdMiN_loggin`
- **Email:** `jatin_admin@parameterx.com`
- **Password:** `HackerJatin987!@#`

### Files to Create/Modify
| File | Action |
|------|--------|
| `src/pages/dashboard/LeadsPage.tsx` | Create — admin leads table |
| `src/components/dashboard/DashboardSidebar.tsx` | Edit — add Leads nav link |
| `src/App.tsx` | Edit — add `/dashboard/leads` route |
| `src/components/DetailedServicePageLayout.tsx` | Edit — remove `extendedDescription` from hero |
| 9 service page files | Edit — shorten tagline/description text |
| Auth config | Enable auto-confirm email signups |

