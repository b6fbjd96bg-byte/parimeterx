
# Credit-Based Scanning System

## Overview
Users get 5 free scans on signup. After that, they purchase credit packs to run more scans. Admins can view/manage all users and their credits.

## Database Changes

### 1. `user_credits` table
- `user_id` (uuid, references auth.users)
- `credits_remaining` (integer, default 5)
- `total_credits_purchased` (integer, default 0)
- `total_scans_used` (integer, default 0)
- Auto-created when user signs up (via trigger)
- RLS: users see own row, admins see all

### 2. `credit_transactions` table
- `user_id`, `amount`, `type` (free_signup | purchase | scan_deduction)
- `description`, `created_at`
- Tracks all credit changes for audit trail

### 3. Modify scan creation flow
- Before creating a scan, check `credits_remaining > 0`
- Deduct 1 credit per scan
- Show credit balance in dashboard header

## Frontend Changes

### 4. Dashboard — Credit display
- Show remaining credits badge in dashboard header
- Warning when credits are low (≤2)
- Block scan creation with message when credits = 0

### 5. Credits/Pricing page
- Simple credit packs: 10 credits ($9), 25 credits ($19), 50 credits ($29)
- Stripe integration for payment

### 6. Admin Panel — User management
- New "Users" section in admin panel showing all registered users
- Display: email, name, role, credits remaining, total scans, join date
- Admin actions: adjust credits manually, view scan history
- Search/filter users

## Flow
1. User signs up → trigger creates `user_credits` row with 5 free credits
2. User runs scan → 1 credit deducted → `credit_transactions` logged
3. Credits hit 0 → "Buy Credits" prompt shown
4. User purchases credits via Stripe → credits added
5. Admin can view all users, adjust credits, see activity
