-- 3. Lobbies Table
create table if not exists public.lobbies (
  id uuid default uuid_generate_v4() primary key,
  host_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  is_public boolean default true not null,
  join_code text unique, -- 6 character string for private lobbies
  status text default 'waiting' not null, -- waiting, playing, finished
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Lobby Players Table
create table if not exists public.lobby_players (
  lobby_id uuid references public.lobbies(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  team text default 'A', -- Team classification inside lobby (A, B)
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (lobby_id, user_id)
);

-- Enable RLS for multiplayer tables
alter table public.lobbies enable row level security;
alter table public.lobby_players enable row level security;

-- Lobby Policies
-- Note: If these policies already exist, running this may throw an error. 
-- In Postgres, dropping them first clears the way if you need to rerun this script.
drop policy if exists "Lobbies viewable by everyone." on lobbies;
create policy "Lobbies viewable by everyone."
  on lobbies for select
  using ( true );

drop policy if exists "Authenticated users can create lobbies." on lobbies;
create policy "Authenticated users can create lobbies."
  on lobbies for insert
  with check ( auth.uid() = host_id );

drop policy if exists "Host can update lobby status." on lobbies;
create policy "Host can update lobby status."
  on lobbies for update
  using ( auth.uid() = host_id );

drop policy if exists "Lobby players viewable by everyone." on lobby_players;
create policy "Lobby players viewable by everyone."
  on lobby_players for select
  using ( true );

drop policy if exists "Users can join lobbies." on lobby_players;
create policy "Users can join lobbies."
  on lobby_players for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can leave lobbies." on lobby_players;
create policy "Users can leave lobbies."
  on lobby_players for delete
  using ( auth.uid() = user_id );
