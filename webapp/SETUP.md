# Setting up the Artz On Show Manager App

This is a real, deployable web app: managers sign in with a magic-link email
(no passwords), tick off checklists and award points, and it all syncs live
across every device at a hub through a Supabase database. This guide gets it
from code to a live URL.

## 1. Create a Supabase project (free tier)

1. Go to [supabase.com](https://supabase.com) and sign up / sign in.
2. **New project** — pick any name and region, set a database password (you
   won't need it day-to-day, Supabase manages it).
3. Wait ~2 minutes for it to provision.
4. In the left sidebar, go to **Project Settings > API**. You'll need three
   values from this page in a minute:
   - **Project URL**
   - **anon / public** key
   - **service_role** key (click "Reveal" — keep this one secret, never put
     it in client-side code or a public repo)

## 2. Run the database setup

1. In the Supabase dashboard, open **SQL Editor > New query**.
2. Open `supabase/schema.sql` from this project, paste the whole file in,
   and click **Run**. This creates all the tables (profiles, invites, ticks,
   points, sign-offs) and the security rules that keep each manager scoped
   to their own hub.

## 3. Set environment variables

Copy `.env.local.example` to `.env.local` and fill in the three Supabase
values from step 1, plus:

- `OWNER_EMAIL` — your own email address. The first time you sign in with
  this address, you automatically become the app's Owner, with access to
  every hub and the admin screen to invite everyone else. After that, you
  manage all further invites from inside the app — you won't need to touch
  Supabase or this variable again.

## 4. Run it locally (optional, to try before deploying)

```bash
npm install
npm run dev
```

Open http://localhost:3000, sign in with your `OWNER_EMAIL` address, and
check your inbox for the sign-in link.

## 5. Deploy to a live URL (Vercel)

1. Push this repository to GitHub (ask your coding assistant to do this if
   you haven't already).
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and
   **Add New Project** → import this repo. Set the project's **Root
   Directory** to `webapp` (since the repo also contains the original design
   files alongside the app).
3. Under **Environment Variables**, add the same four values from your
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `OWNER_EMAIL`).
4. Click **Deploy**. You'll get a live `https://your-app.vercel.app` URL.

## 6. Add your managers

Sign in as the Owner, go to **Manage managers** from the hub picker, and
invite each manager by email — pick which hub(s) they can access. They get
access the moment they sign in with that email; there's no separate invite
email to send, just let them know to visit the app.

## What's in / not in this version

- **In**: every checklist, schedule, the points system, Morning Welcome,
  Group Time, the Closing Speech, venue info — all the real content from the
  design, plus login, an owner-managed invite list, and live sync across
  devices at the same hub.
- **Not in (by design, for now)**: an in-app editor for checklist wording —
  content lives in code (`src/lib/data/`) and changes go through your coding
  assistant, the same way the original design did. Say the word if you'd
  rather have an admin screen for editing checklist text directly.
