create table public.discussion_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  created_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.discussion_topics to authenticated;
grant all on public.discussion_topics to service_role;
alter table public.discussion_topics enable row level security;
create policy "Read topics" on public.discussion_topics for select to authenticated using (true);
create policy "Staff write topics" on public.discussion_topics for all to authenticated
  using (public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));

create table public.discussion_posts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.discussion_topics(id) on delete cascade,
  parent_id uuid references public.discussion_posts(id) on delete cascade,
  user_id uuid not null,
  author_name text not null default '',
  body text not null,
  pops jsonb,
  edited boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.discussion_posts to authenticated;
grant all on public.discussion_posts to service_role;
alter table public.discussion_posts enable row level security;
create policy "Read posts" on public.discussion_posts for select to authenticated using (true);
create policy "Insert own posts" on public.discussion_posts for insert to authenticated with check (auth.uid() = user_id);
create policy "Update own posts" on public.discussion_posts for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Delete own or staff" on public.discussion_posts for delete to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));

create table public.post_likes (
  post_id uuid not null references public.discussion_posts(id) on delete cascade,
  user_id uuid not null,
  primary key (post_id, user_id)
);
grant select, insert, delete on public.post_likes to authenticated;
grant all on public.post_likes to service_role;
alter table public.post_likes enable row level security;
create policy "Read likes" on public.post_likes for select to authenticated using (true);
create policy "Like own" on public.post_likes for insert to authenticated with check (auth.uid() = user_id);
create policy "Unlike own" on public.post_likes for delete to authenticated using (auth.uid() = user_id);

create table public.post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.discussion_posts(id) on delete cascade,
  user_id uuid not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);
grant select, insert on public.post_reports to authenticated;
grant all on public.post_reports to service_role;
alter table public.post_reports enable row level security;
create policy "Report own" on public.post_reports for insert to authenticated with check (auth.uid() = user_id);
create policy "Staff read reports" on public.post_reports for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));

create or replace function public.on_discussion_post()
returns trigger language plpgsql security definer set search_path = public as $$
declare _n int; _t text;
begin
  select title into _t from discussion_topics where id = new.topic_id;
  insert into activity_log(user_id, module, title)
    values (new.user_id, 'munozara', case when new.parent_id is null then 'Munozaraga fikr: ' else 'Javob yozildi: ' end || coalesce(_t,''));
  select count(*) into _n from discussion_posts where user_id = new.user_id;
  insert into module_progress(user_id, module, percent, updated_at) values (new.user_id, 'munozara', least(100, _n * 20), now())
    on conflict (user_id, module) do update set percent = excluded.percent, updated_at = now();
  return new;
end; $$;
create trigger discussion_post_progress after insert on public.discussion_posts
  for each row execute function public.on_discussion_post();

insert into public.discussion_topics (title, description) values
('Turli madaniyatlarda mehmondo‘stlik qanday ifodalanadi?','O‘z madaniyatingiz va o‘rganilayotgan madaniyatdagi mehmon kutish odatlarini qiyoslang.'),
('Bir xil ibora turli madaniyatlarda qanday farqli ma’no berishi mumkin?','Misollar keltiring va farqlarning sababini tushuntiring.'),
('Madaniyatlararo muloqotda stereotiplarning o‘rni qanday?','Stereotiplar muloqotga qanday ta’sir qiladi va ularni qanday yengish mumkin?');