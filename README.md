# Bouquet Creator

Design a one-of-a-kind watercolor flower bouquet with AI — pick your flowers, mood,
and color palette (or just describe it in your own words), generate a painting, and
save it to a personal gallery.

Built with Next.js App Router, TypeScript, Tailwind CSS, Supabase (auth + Postgres),
and Replicate (FLUX Schnell image generation).

## Features

- **Landing page** introducing the product with a clear call to action.
- **3-step guided wizard** — flowers → mood → color palette — built on a reusable
  `useWizard` hook with validation, back/next navigation, and reset.
- **Free-form prompt fallback** — describe the bouquet in your own words instead of
  using the guided steps.
- **AI image generation** via `POST /api/generate`, which builds a prompt through a
  dedicated prompt-builder module and calls Replicate's FLUX Schnell model.
- **Google sign-in** via Supabase Auth. Anyone can generate a bouquet; saving it
  requires signing in.
- **Personal gallery** at `/gallery` with a responsive grid, delete support, and a
  polished empty state.
- **76 automated tests** across hooks, components, prompt logic, the Replicate
  client, and API route handlers.

## Project structure

```text
app/
  page.tsx                  Landing page
  create/page.tsx            Wizard + generate + save flow (client component)
  gallery/
    page.tsx                 Server component: fetches the user's bouquets
    GalleryPageClient.tsx     Client wrapper wiring up delete requests
  api/
    generate/route.ts         POST /api/generate
    save/route.ts              POST /api/save
    bouquets/[id]/route.ts     DELETE /api/bouquets/:id
  auth/
    callback/route.ts          OAuth callback (code -> session exchange)
    auth-code-error/page.tsx   Shown if the OAuth exchange fails

components/
  wizard/
    SelectableCard.tsx         Shared selectable card used by all 3 steps
    FlowerStep.tsx
    MoodStep.tsx
    ColorStep.tsx
    PromptFallback.tsx
    WizardNav.tsx
  BouquetResult.tsx            Generated image + save/start-over actions
  GalleryGrid.tsx              Responsive grid + delete + empty state
  AuthButton.tsx                Google sign-in / sign-out
  SiteHeader.tsx
  BloomMark.tsx                 Signature SVG mark used throughout the UI

hooks/
  useWizard.ts                  Wizard state: selections, navigation, validation

lib/
  types.ts                      Shared types + option lists (flowers/moods/palettes)
  promptBuilder.ts               Turns wizard state into an image-generation prompt
  replicate.ts                   Replicate API client (create + poll a prediction)
  supabase/
    client.ts                    Browser Supabase client
    server.ts                    Server Supabase client (cookies-aware)

middleware.ts                   Refreshes the Supabase session cookie on each request

supabase/
  migrations/0001_create_bouquets.sql   bouquets table + RLS policies

__tests__/
  hooks/, lib/, components/, api/
```

## Architecture and data flow

```text
User
  → Wizard (FlowerStep / MoodStep / ColorStep) or free-form PromptFallback
  → useWizard hook holds { flowers, mood, colorPalette, customPrompt }
  → POST /api/generate
      → lib/promptBuilder.ts builds the final image prompt
      → lib/replicate.ts calls Replicate's FLUX Schnell model and polls until done
      ← { imageUrl, prompt }
  → BouquetResult renders the generated painting
  → POST /api/save (requires an authenticated session)
      → Supabase server client inserts a row into `bouquets`, scoped to auth.uid()
  → /gallery (server component)
      → Supabase server client selects the signed-in user's bouquets (RLS-enforced)
      → GalleryGrid renders them; DELETE /api/bouquets/:id removes a saved bouquet
```

### Authentication flow

1. `AuthButton` calls `supabase.auth.signInWithOAuth({ provider: "google" })` from
   the browser client, redirecting to Google.
2. Google redirects back to `/auth/callback?code=...`.
3. The callback route handler exchanges the code for a session using the server
   Supabase client (`exchangeCodeForSession`), which sets the auth cookies, then
   redirects to `/create` (or `?next=` if provided).
4. `middleware.ts` calls `supabase.auth.getUser()` on every request so the session
   cookie stays fresh across Server Components and Route Handlers.
5. `/api/save` and `/api/bouquets/[id]` both check `supabase.auth.getUser()` and
   return `401` if there's no session — generating a bouquet never requires auth,
   only saving/deleting does.

### Image generation flow

- `lib/promptBuilder.ts` is a small, pure, unit-testable module: given the wizard
  state it returns a single prompt string. A non-empty `customPrompt` takes
  precedence over the guided selections; either path is wrapped with the same
  watercolor art-direction suffix so the visual style stays consistent.
- `lib/replicate.ts` posts to Replicate's `black-forest-labs/flux-schnell` model,
  then polls the prediction's status URL until it succeeds, fails, or times out.
  The Replicate API token is read from `process.env.REPLICATE_API_TOKEN` and never
  sent to the browser — all Replicate calls happen inside the `/api/generate`
  route handler.

### Database / RLS design

The `bouquets` table (see `supabase/migrations/0001_create_bouquets.sql`) stores:

| column         | type        |
|----------------|-------------|
| id             | uuid, PK    |
| user_id        | uuid, FK -> auth.users |
| image_url      | text        |
| prompt         | text        |
| flowers        | text[]      |
| mood           | text        |
| color_palette  | text        |
| created_at     | timestamptz |

Row Level Security is enabled with three policies, each scoped to `auth.uid() =
user_id`:

- **select** — a user can only read their own bouquets.
- **insert** — a user can only insert rows under their own `user_id`.
- **delete** — a user can only delete their own bouquets.

No `update` policy is defined; bouquets are immutable once saved, and with RLS
enabled, the absence of a matching policy denies updates by default.

### Testing strategy

76 tests across four layers, run with Jest + React Testing Library:

- **Unit — `lib/`**: prompt construction (guided vs. custom prompt, fallbacks,
  validation) and the Replicate client (success, polling, failure, timeouts,
  missing token).
- **Unit — `hooks/`**: `useWizard` initialization, single/multiple flower
  selection, mood/palette selection, next/back navigation, validation gating,
  custom-prompt bypass, completion state, and reset.
- **Component — `components/`**: each wizard step renders its options and reports
  selections correctly; `WizardNav` shows the right button per step and disables
  it when invalid; `GalleryGrid` renders cards, the empty state, and removes a
  card after a successful delete.
- **Integration/API — `app/api/`**: route handlers are tested directly (Replicate
  and Supabase clients are mocked) for request validation, auth enforcement
  (401s), success paths, and error handling (400/401/404/500/502).

Run tests with:

```bash
npm test
npm run test:coverage
```

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **Authentication → Providers**, enable **Google** and configure your OAuth
   client (see [Supabase's Google Auth guide](https://supabase.com/docs/guides/auth/social-login/auth-google)).
3. Add your local and production callback URLs as **Redirect URLs** in
   **Authentication → URL Configuration**, e.g. `http://localhost:3000/auth/callback`.
4. Run the migration against your project:

   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

   (Or paste the contents of `supabase/migrations/0001_create_bouquets.sql` into
   the Supabase SQL editor.)

### 3. Set up Replicate

Create an API token at [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens).

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
REPLICATE_API_TOKEN=
```

### 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Deployment notes

- Set the same three environment variables in your hosting provider (e.g. Vercel).
- Add your production domain's `/auth/callback` URL to Supabase's redirect URL
  allow-list.
- `REPLICATE_API_TOKEN` must only ever be set as a server-side environment
  variable — it is never referenced from client components.
