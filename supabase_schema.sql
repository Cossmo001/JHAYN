-- Schema for JHAYN Quiz Web App

-- 1. Profiles Table (extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Scores & Leaderboard Table
create table public.scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_id text not null,     -- e.g. 'programming', 'networking'
  score int not null,
  total int not null,
  percentage int not null,      -- e.g. 85
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.scores enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

create policy "Scores are viewable by everyone."
  on scores for select
  using ( true );

create policy "Authenticated users can insert their own scores."
  on scores for insert
  with check ( auth.uid() = user_id );

-- Create trigger to automatically add profile row on standard Supabase sign up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Lobbies Table
create table public.lobbies (
  id uuid default uuid_generate_v4() primary key,
  host_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  is_public boolean default true not null,
  join_code text unique, -- 6 character string for private lobbies
  status text default 'waiting' not null, -- waiting, playing, finished
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Lobby Players Table
create table public.lobby_players (
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
create policy "Lobbies viewable by everyone."
  on lobbies for select
  using ( true );

create policy "Authenticated users can create lobbies."
  on lobbies for insert
  with check ( auth.uid() = host_id );

create policy "Host can update lobby status."
  on lobbies for update
  using ( auth.uid() = host_id );

create policy "Lobby players viewable by everyone."
  on lobby_players for select
  using ( true );

create policy "Users can join lobbies."
  on lobby_players for insert
  with check ( auth.uid() = user_id );

create policy "Users can leave lobbies."
  on lobby_players for delete
  using ( auth.uid() = user_id );
