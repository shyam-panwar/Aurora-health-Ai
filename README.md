# Aurora — Mobile Health Companion

A polished Expo mobile app with Supabase backend, health tracking, and a voice-first AI companion.

## Structure

- `mobile/` — Expo Router app (auth, onboarding, tabs, companion)
- `supabase/` — Postgres migrations + Edge Functions
- `api/` — Optional Express JWT validation service (Module 1 artifact)

## Features

- Email, Google, and Apple authentication
- 5-step onboarding with profile and goal capture
- Health tracking: hydration, sleep, habits, nutrition
- Aggregated home dashboard with daily insights
- Voice/text AI companion with tool-calling (hydration, sleep, habits, meals)
- Weekly reports and integration placeholders

## Setup

### 1. Supabase

1. Create a Supabase project
2. Run migrations in order:
   - `supabase/migrations/001_auth_profiles.sql`
   - `supabase/migrations/002_health_schema.sql`
   - `supabase/migrations/003_rls_health.sql`
3. Enable Email, Google, and Apple auth providers
4. Add redirect URLs:
   - `auroraauth://auth/callback`
   - `auroraauth://reset-password`
5. Set edge-function secrets:
   ```bash
   supabase secrets set OPENAI_API_KEY=your-openai-key
   ```
6. Validate the edge functions locally:
   ```bash
   deno check supabase/functions/agent-turn/index.ts
   deno check supabase/functions/bootstrap/index.ts
   deno check supabase/functions/daily-summary/index.ts
   deno check supabase/functions/generate-insight/index.ts
   ```
7. Set a free-tier AI key for the Supabase functions if you want Gemini fallback replies and richer insights:
   ```bash
   supabase secrets set GEMINI_API_KEY=your-gemini-api-key
   ```
8. Deploy edge functions (optional, app has client fallbacks):
   ```bash
   supabase functions deploy bootstrap
   supabase functions deploy agent-turn
   supabase functions deploy daily-summary
   supabase functions deploy generate-insight
   ```

### 2. Mobile

```bash
cd mobile
cp .env.example .env
# Fill EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npm install --legacy-peer-deps
npm start
```

Use a development build for microphone and OAuth in production-like conditions.

## Demo flows

1. Sign up → complete onboarding → land on dashboard
2. Log water via Hydration tab or say "I drank 500ml water" to Aurora
3. Log sleep, create habits, log meals manually
4. Ask Aurora "How am I doing this week?" for a progress summary
5. View weekly report from Profile tab

## Notes

- The companion uses server-side OpenAI when edge functions are deployed; otherwise client-side pattern matching + `expo-speech` fallback
- The edge functions authenticate users through the Supabase Authorization header even though JWT verification is disabled in local config
- Manual tracking is the default; device integrations are placeholder-only
- Insights are wellness-oriented and non-diagnostic
