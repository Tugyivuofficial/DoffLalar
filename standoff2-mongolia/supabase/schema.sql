create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  points int not null default 0,
  wins_5v5 int not null default 0,
  wins_2v2 int not null default 0,
  losses_5v5 int not null default 0,
  losses_2v2 int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lobbies (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null check (mode in ('5v5','2v2')),
  map text not null,
  room_code text,
  is_private boolean not null default false,
  status text not null default 'waiting' check (status in ('waiting','started','finished')),
  winner_team text check (winner_team in ('CT','T')),
  created_at timestamptz not null default now()
);

create table if not exists public.lobby_members (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid not null references public.lobbies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  team text check (team in ('CT','T')),
  joined_at timestamptz not null default now(),
  unique(lobby_id,user_id)
);

alter table public.profiles enable row level security;
alter table public.lobbies enable row level security;
alter table public.lobby_members enable row level security;

create policy "profiles read all" on public.profiles for select using (true);
create policy "profiles insert self" on public.profiles for insert with check (auth.uid()=id);
create policy "profiles update self" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);

create policy "lobbies read all" on public.lobbies for select using (true);
create policy "lobbies create self" on public.lobbies for insert with check (auth.uid()=host_id);
create policy "lobbies update host" on public.lobbies for update using (auth.uid()=host_id);

create policy "members read all" on public.lobby_members for select using (true);
create policy "members join self" on public.lobby_members for insert with check (auth.uid()=user_id);
create policy "members update self" on public.lobby_members for update using (auth.uid()=user_id);
create policy "members delete self" on public.lobby_members for delete using (auth.uid()=user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, username, avatar_url)
  values(new.id, coalesce(split_part(new.email,'@',1),'Player'), new.raw_user_meta_data->>'avatar_url')
  on conflict(id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.join_lobby(p_lobby_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_mode text; v_count int; v_max int;
begin
  if v_user is null then raise exception 'not authenticated'; end if;
  insert into public.profiles(id, username) values(v_user, 'Player') on conflict(id) do nothing;
  select mode into v_mode from public.lobbies where id=p_lobby_id and status='waiting';
  if v_mode is null then raise exception 'lobby not joinable'; end if;
  select count(*) into v_count from public.lobby_members where lobby_id=p_lobby_id;
  v_max := case when v_mode='2v2' then 4 else 10 end;
  if v_count >= v_max and not exists(select 1 from public.lobby_members where lobby_id=p_lobby_id and user_id=v_user) then raise exception 'lobby full'; end if;
  insert into public.lobby_members(lobby_id,user_id) values(p_lobby_id,v_user) on conflict(lobby_id,user_id) do nothing;
end; $$;

create or replace function public.finish_match(p_lobby_id uuid, p_winner_team text)
returns void language plpgsql security definer set search_path = public as $$
declare v_lobby record; v_points int;
begin
  select * into v_lobby from public.lobbies where id=p_lobby_id;
  if v_lobby.id is null then raise exception 'lobby not found'; end if;
  if auth.uid() <> v_lobby.host_id then raise exception 'only host can finish'; end if;
  if p_winner_team not in ('CT','T') then raise exception 'bad winner'; end if;
  if v_lobby.status='finished' then return; end if;
  v_points := case when v_lobby.mode='5v5' then 150 else 80 end;
  update public.lobbies set status='finished', winner_team=p_winner_team where id=p_lobby_id;
  update public.profiles p set points=p.points+v_points,
    wins_5v5=p.wins_5v5 + case when v_lobby.mode='5v5' then 1 else 0 end,
    wins_2v2=p.wins_2v2 + case when v_lobby.mode='2v2' then 1 else 0 end
  from public.lobby_members lm where lm.user_id=p.id and lm.lobby_id=p_lobby_id and lm.team=p_winner_team;
  update public.profiles p set
    losses_5v5=p.losses_5v5 + case when v_lobby.mode='5v5' then 1 else 0 end,
    losses_2v2=p.losses_2v2 + case when v_lobby.mode='2v2' then 1 else 0 end
  from public.lobby_members lm where lm.user_id=p.id and lm.lobby_id=p_lobby_id and lm.team is not null and lm.team<>p_winner_team;
end; $$;

grant usage on schema public to anon, authenticated;
grant all on public.profiles, public.lobbies, public.lobby_members to authenticated;
grant select on public.profiles, public.lobbies, public.lobby_members to anon;
grant execute on function public.join_lobby(uuid) to authenticated;
grant execute on function public.finish_match(uuid,text) to authenticated;
