
# 🗄️ Seamless Database Integration Guide (Supabase Edition)

This guide outlines how to connect **Supabase** as the persistent data layer for **File Pilot AI**.

---

## 🏗️ Architecture Overview

For **File Pilot AI**, we use Supabase to manage user authentication and log "mission telemetry" (tool usage, success rates, and input patterns).

1.  **Auth**: Supabase GoTrue handled via `components/AuthPage.tsx`.
2.  **Telemetry**: Every `EXECUTE MISSION` action logs to the `mission_logs` table, linked to the user's UUID.
3.  **Storage**: Supabase Postgres.

---

## 🚀 Implementation Steps

### 1. Database Schema
Run this SQL in your **Supabase SQL Editor** to set up the updated logging table:

```sql
-- 1. Create the logs table with user association
create table mission_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id), -- Linked to Supabase Auth
  tool_id text not null,
  tool_name text not null,
  category text,
  status text check (status in ('SUCCESS', 'ERROR')),
  input_snippet text
);

-- 2. Enable Row Level Security (RLS)
alter table mission_logs enable row level security;

-- 3. Policy: Allow users to view only THEIR OWN logs
create policy "Users can view own logs"
on mission_logs for select
to authenticated
using (auth.uid() = user_id);

-- 4. Policy: Allow authenticated users to create logs
create policy "Authenticated users can insert logs"
on mission_logs for insert
to authenticated
with check (auth.uid() = user_id);

-- 5. Policy: Allow anonymous logs (optional, if you support guest mode)
create policy "Allow anonymous inserts"
on mission_logs for insert
to anon
with check (true);
```

### 2. Environment Variables
Ensure these are set in your `.env` or Vercel dashboard:

```env
SUPABASE_URL="https://vspbmatsnqypdxhdzsfi.supabase.co"
SUPABASE_ANON_KEY="your_anon_key_here"
```

### 3. Usage in App
The system uses `services/supabaseService.ts`. The `logMission` function automatically retrieves the current user session via `supabase.auth.getUser()` before inserting.

---

## 🔒 Security Best Practices
- **RLS (Row Level Security)** ensures a user can never see or modify mission logs belonging to another user.
- **Google OAuth** is configured through the Supabase Dashboard > Authentication > Providers.

---

**File Pilot AI** — *Vectoring Intelligence for the Modern Web.*
