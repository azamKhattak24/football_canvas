# Football Pitch Tactical Board

Next.js App Router with TypeScript, Tailwind CSS, Lucide React, Supabase, Zustand, Konva, and react-konva.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000. Use `npm run lint`, `npm run typecheck`, and `npm run build` to validate changes. Run `npm start` to serve a production build.

## Structure

```text
app/                  App Router pages, root layout, and global styles
components/canvas/    Pitch and interactive canvas components
components/ui/        Shared interface components
lib/supabase/         Lazy Supabase client configuration
store/                Zustand state stores
```

All stored pitch coordinates `(x, y)` must be normalized to the range `[0, 1]`, relative to the pitch dimensions. Convert to pixels only for rendering and convert drag positions back to normalized coordinates before updating state. Keep canvas modules behind a client boundary; load browser-only canvas components with `next/dynamic` and `ssr: false` from a Client Component.

## Supabase

Copy `.env.example` to `.env.local` and replace the placeholders with your project's URL and public publishable key. Import `getSupabaseClient` from `@/lib/supabase/client` when adding data access. The starter page runs without credentials. Never put a service-role or secret key in a `NEXT_PUBLIC_` variable.

This scaffold does not yet implement the interactive board, stores, authentication, or database tables.
