# Standoff 2 Mongolia

Mobile-first FACEIT-style match hosting app for Standoff 2 using Next.js 14, TypeScript, Supabase Auth/DB/Realtime, Vercel.

## Setup
1. Create Supabase project.
2. Open Supabase SQL Editor and run `supabase/schema.sql`.
3. Supabase > Authentication > URL Configuration:
   - Site URL: your Vercel URL
   - Redirect URLs: `https://your-vercel-app.vercel.app/**`
4. Enable Google provider in Supabase Auth if needed.
5. In Vercel add env vars from `.env.example`.
6. Deploy.

Login redirect is handled with `router.replace('/home')` after `signInWithPassword` succeeds.
