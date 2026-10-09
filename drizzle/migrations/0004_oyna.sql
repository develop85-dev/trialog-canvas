create table public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null default 'diary',
  body text not null default '',
  ratings jsonb,
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.reflections to authenticated;
grant all on public.reflections to service_role;
alter table public.reflections enable row level security;
create policy "Read own or staff" on public.reflections for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));
create policy "Insert own" on public.reflections for insert to authenticated with check (auth.uid() = user_id);
create policy "Delete own" on public.reflections for delete to authenticated using (auth.uid() = user_id);

create or replace function public.on_reflection()
returns trigger language plpgsql security definer set search_path = public as $$
declare _n int;
begin
  insert into activity_log(user_id, module, title) values (new.user_id, 'oyna',
    case when new.kind = 'self' then 'O‘z-o‘zini baholash' else 'Refleksiya kundaligiga yozuv' end);
  select count(*) into _n from reflections where user_id = new.user_id;
  insert into module_progress(user_id, module, percent, updated_at) values (new.user_id, 'oyna', least(100, _n * 25), now())
    on conflict (user_id, module) do update set percent = excluded.percent, updated_at = now();
  return new;
end; $$;
create trigger reflection_progress after insert on public.reflections
  for each row execute function public.on_reflection();