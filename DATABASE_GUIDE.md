
# 🗄️ Seamless Database Integration Guide (Supabase Edition)

This guide outlines how to connect **Supabase** as the persistent data layer for **File Pilot AI**.

---

## 🏗️ Architecture Overview

For **File Pilot AI**, we use Supabase to log "mission telemetry" (tool usage, success rates, and input patterns).

1.  **Client**: `@supabase/supabase-js` used directly in the frontend for "Anon" access.
2.  **Telemetry**: Every `EXECUTE MISSION` action logs to the `mission_logs` table.
3.  **Storage**: Supabase Postgres.

---

## 🚀 Implementation Steps

### 1. Database Schema
Run this SQL in your **Supabase SQL Editor** to set up the logging table:

```sql
create table mission_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  tool_id text not null,
  tool_name text not null,
  category text,
  status text check (status in ('SUCCESS', 'ERROR')),
  input_snippet text
);

-- Enable Row Level Security (RLS)
alter table mission_logs enable row level security;

-- Allow anonymous inserts (for logging purposes)
create policy "Allow anonymous inserts"
on mission_logs for insert
with check (true);

-- Allow anonymous reads (optional, for dashboard)
create policy "Allow anonymous reads"
on mission_logs for select
using (true);
```

### 2. Environment Variables
Ensure these are set in your `.env` or Vercel dashboard:

```env
SUPABASE_URL="https://vspbmatsnqypdxhdzsfi.supabase.co"
SUPABASE_ANON_KEY="your_anon_key_here"
```

### 3. Usage in App
The system already includes `services/supabaseService.ts` which handles the connection. Every time a tool is executed, the `logMission` function is called within `ToolInterface.tsx`.

### 4. Monitoring
You can view live mission telemetry directly in the **Supabase Table Editor**. This allows you to track:
- Which tools are used most.
- Average failure rates (to tune system instructions).
- Input patterns for better product development.

---

## 🔒 Security Best Practices
- **RLS (Row Level Security)** is enabled by default. We only allow `INSERT` for anonymous users.
- For sensitive data, do not store full file content in the `input_snippet`. The current implementation truncates input to 500 characters.

---

**File Pilot AI** — *Vectoring Intelligence for the Modern Web.*
