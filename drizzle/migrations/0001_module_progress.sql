create table public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  module text not null check (module in ('soz','matn','munozara','oyna')),
  percent int not null default 0 check (percent between 0 and 100),
  updated_at timestamptz not null default now(),
  unique (user_id, module)
);
grant select, insert, update on public.module_progress to authenticated;
grant all on public.module_progress to service_role;
alter table public.module_progress enable row level security;
create policy "Read own or staff" on public.module_progress for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));
create policy "Insert own" on public.module_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "Update own" on public.module_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  module text,
  title text not null,
  created_at timestamptz not null default now()
);
grant select, insert on public.activity_log to authenticated;
grant all on public.activity_log to service_role;
alter table public.activity_log enable row level security;
create policy "Read own or staff" on public.activity_log for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));
create policy "Insert own" on public.activity_log for insert to authenticated with check (auth.uid() = user_id);