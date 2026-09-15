-- Run as the database owner after applying the migration. All fixtures roll back.
begin;

do $$
declare
  team uuid;
  player uuid;
  board uuid;
  invalid_coordinate double precision;
begin
  insert into public.teams (name, primary_color, secondary_color)
    values ('Test team', '#ffffff', '#000000') returning id into team;
  insert into public.players (team_id, name, jersey_number, position)
    values (team, 'Test player', 1, 'GK') returning id into player;
  insert into public.tactical_boards (title) values ('Test board') returning id into board;
  insert into public.board_positions (board_id, player_id, rel_x, rel_y)
    values (board, player, 0, 1);

  foreach invalid_coordinate in array array[-0.01, 1.01, 'NaN'::double precision,
    'Infinity'::double precision, '-Infinity'::double precision]
  loop
    begin
      update public.board_positions set rel_x = invalid_coordinate where board_id = board;
      raise exception 'Invalid rel_x accepted: %', invalid_coordinate;
    exception when check_violation then null;
    end;
    begin
      update public.board_positions set rel_y = invalid_coordinate where board_id = board;
      raise exception 'Invalid rel_y accepted: %', invalid_coordinate;
    exception when check_violation then null;
    end;
  end loop;

  begin
    update public.board_positions set rel_x = null where board_id = board;
    raise exception 'Null coordinate accepted';
  exception when not_null_violation then null;
  end;

  begin
    insert into public.board_positions (board_id, player_id, rel_x, rel_y)
      values (board, player, 0.5, 0.5);
    raise exception 'Duplicate player on board accepted';
  exception when unique_violation then null;
  end;

  begin
    update public.board_positions set player_id = gen_random_uuid() where board_id = board;
    raise exception 'Missing player accepted';
  exception when foreign_key_violation then null;
  end;

  begin
    update public.board_positions set board_id = gen_random_uuid() where board_id = board;
    raise exception 'Missing board accepted';
  exception when foreign_key_violation then null;
  end;

  begin
    update public.players set team_id = gen_random_uuid() where id = player;
    raise exception 'Missing team accepted';
  exception when foreign_key_violation then null;
  end;

  begin
    delete from public.teams where id = team;
    raise exception 'Team with players was deleted';
  exception when foreign_key_violation then null;
  end;

  delete from public.tactical_boards where id = board;
  if exists (select 1 from public.board_positions where board_id = board) then
    raise exception 'Board deletion did not cascade';
  end if;

  insert into public.tactical_boards (title) values ('Second board') returning id into board;
  insert into public.board_positions (board_id, player_id, rel_x, rel_y)
    values (board, player, 1, 0);
  delete from public.players where id = player;
  if exists (select 1 from public.board_positions where player_id = player) then
    raise exception 'Player deletion did not cascade';
  end if;
end $$;

rollback;
