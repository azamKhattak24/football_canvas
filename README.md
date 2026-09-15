# Football Pitch Tactical Board

Next.js App Router with TypeScript, Tailwind CSS, Lucide React, Supabase, Zustand, Konva, and react-konva.

## Development

Use Node.js 22.13+ (or Node.js 24+). With nvm, run `nvm install` to use the project's Node 22 release line.

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

### Database migrations and types

The initial migration is `supabase/migrations/20260916000000_create_tactical_board_tables.sql`.
Apply it through the Supabase SQL editor, or with the Supabase CLI from this project:

```sh
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

All fields are required. UUIDs and the board creation timestamp have database defaults;
`created_at` uses a timezone-aware PostgreSQL timestamp. Positions use double precision
floats constrained to `[0, 1]`, including endpoints. Each player can appear once per board.
Deleting a board or player removes associated positions; deleting a team with players is
restricted so it cannot silently remove a roster.

Row-level security is enabled with no policies. Anonymous access is revoked and
authenticated queries cannot access rows until an authorization migration adds policies.
The current schema has no user ownership or membership fields; define that model before
granting browser access. Do not use a service-role key in the browser to bypass RLS.

`lib/supabase/database.types.ts` contains schema-derived types in Supabase's generated
format, including foreign-key relationships. They were prepared from the migration,
not introspected from a running database. After applying migrations, regenerate them:

```sh
npx supabase gen types typescript --linked --schema public > lib/supabase/database.types.ts
npm run typecheck
```

The client re-exports `Database`, `Json`, `Tables`, `TablesInsert`, `TablesUpdate`,
and the row aliases `Team`, `Player`, `TacticalBoard`, and `BoardPosition`:

```ts
import { getSupabaseClient, type TablesInsert } from "@/lib/supabase/client";

const board: TablesInsert<"tactical_boards"> = { title: "Match plan" };
const { data, error } = await getSupabaseClient()
  .from("tactical_boards")
  .insert(board)
  .select()
  .single();
```

Once the migration is applied, run `supabase/tests/constraints.sql` as the database
owner in the SQL editor (or via `psql -v ON_ERROR_STOP=1 -f supabase/tests/constraints.sql`).
It verifies coordinate bounds, invalid foreign keys, uniqueness, and delete behavior,
then rolls back its fixtures.

## Team and player management

Visit `/teams` for the club directory and `/teams/[teamId]` for a squad.
Create teams, search clubs, filter rosters by position, and add, edit, or remove players.
Player names must be non-empty and jersey numbers must be positive PostgreSQL integers.

`lib/mock-data.ts` supplies three illustrative teams with 13 players each. The shared
Zustand store in `store/team-store.ts` keeps counts and rosters synchronized across
client navigation. These changes are session-only and reset on a full reload; no
Supabase writes occur. Role and avatar color are separate UI metadata, preserving the
generated `Team` and `Player` database types without adding nonexistent columns.

The styling uses colors, spacing, radii, Geist/Inter fonts, and three club badge assets
extracted from the supplied `Football Board.fig`. The file labels the directory
`Admin2.1` and the club editor `Admin1.1`; the implementation follows the requested
route responsibilities. Its `Admin2.2` is a wide club editor, adapted here into the
requested player form. Only 1920px desktop frames were supplied: responsive layouts
use Tailwind's 640px, 1024px, and 1280px breakpoints rather than claiming Figma-defined
mobile frames. Native modal dialogs make the background inert, trap keyboard focus,
lock page scrolling, close on Escape, and return focus to the triggering control.

Verification: lint and TypeScript checks; browser checks for team creation, player
creation/editing, directory count updates, empty-name and invalid-number validation,
Tab trapping, Escape dismissal, focus restoration, and a 390px mobile modal layout.

The interactive tactical board and authentication are not yet implemented.
