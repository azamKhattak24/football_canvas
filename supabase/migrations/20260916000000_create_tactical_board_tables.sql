begin;

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  primary_color text not null,
  secondary_color text not null
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete restrict,
  name text not null,
  jersey_number integer not null,
  position text not null
);

create index players_team_id_idx on public.players (team_id);

create table public.tactical_boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz not null default now()
);

create table public.board_positions (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.tactical_boards (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  rel_x double precision not null,
  rel_y double precision not null,
  constraint board_positions_rel_x_normalized check (rel_x >= 0.0 and rel_x <= 1.0),
  constraint board_positions_rel_y_normalized check (rel_y >= 0.0 and rel_y <= 1.0),
  constraint board_positions_board_id_player_id_key unique (board_id, player_id)
);

-- The unique constraint already indexes board_id as its leading column.
create index board_positions_player_id_idx on public.board_positions (player_id);

comment on column public.board_positions.rel_x is 'Horizontal pitch coordinate in [0, 1], relative to pitch width.';
comment on column public.board_positions.rel_y is 'Vertical pitch coordinate in [0, 1], relative to pitch height.';

-- No ownership model is defined yet. Browser access remains denied until
-- explicit policies are added in a subsequent migration.
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.tactical_boards enable row level security;
alter table public.board_positions enable row level security;

grant select, insert, update, delete on public.teams, public.players,
  public.tactical_boards, public.board_positions to authenticated;
revoke all on public.teams, public.players, public.tactical_boards,
  public.board_positions from anon;

commit;
