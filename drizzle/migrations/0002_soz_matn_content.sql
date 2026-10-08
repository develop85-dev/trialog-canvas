create table public.vocab_items (
  id uuid primary key default gen_random_uuid(),
  word text not null,
  category text not null default 'madaniy',
  definition text not null default '',
  translation text not null default '',
  cultural_note text not null default '',
  example text not null default '',
  audio_url text,
  related_phrases text[] not null default '{}',
  related_proverbs text[] not null default '{}',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.vocab_items to authenticated;
grant all on public.vocab_items to service_role;
alter table public.vocab_items enable row level security;
create policy "Read vocab" on public.vocab_items for select to authenticated using (true);
create policy "Staff write vocab" on public.vocab_items for all to authenticated
  using (public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  module text not null default 'soz',
  title text not null,
  kind text not null default 'multiple_choice',
  questions jsonb not null default '[]',
  answer_key jsonb not null default '[]',
  created_at timestamptz not null default now()
);
grant select (id, module, title, kind, questions, created_at) on public.exercises to authenticated;
grant insert, update, delete on public.exercises to authenticated;
grant all on public.exercises to service_role;
alter table public.exercises enable row level security;
create policy "Read exercises" on public.exercises for select to authenticated using (true);
create policy "Staff write exercises" on public.exercises for all to authenticated
  using (public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));

create table public.exercise_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  score int not null,
  answers jsonb not null default '[]',
  created_at timestamptz not null default now()
);
grant select on public.exercise_results to authenticated;
grant all on public.exercise_results to service_role;
alter table public.exercise_results enable row level security;
create policy "Read own or staff results" on public.exercise_results for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));

create table public.texts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text not null default '',
  body text not null,
  context text not null default '',
  key_words text[] not null default '{}',
  notes text[] not null default '{}',
  video_url text,
  questions jsonb not null default '[]',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.texts to authenticated;
grant all on public.texts to service_role;
alter table public.texts enable row level security;
create policy "Read texts" on public.texts for select to authenticated using (true);
create policy "Staff write texts" on public.texts for all to authenticated
  using (public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));

create table public.text_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  text_id uuid not null references public.texts(id) on delete cascade,
  answers jsonb not null default '[]',
  created_at timestamptz not null default now(),
  unique (user_id, text_id)
);
grant select on public.text_responses to authenticated;
grant all on public.text_responses to service_role;
alter table public.text_responses enable row level security;
create policy "Read own or staff responses" on public.text_responses for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(),'teacher') or public.has_role(auth.uid(),'admin'));

create or replace function public.submit_exercise(_exercise_id uuid, _answers jsonb)
returns int language plpgsql security definer set search_path = public as $$
declare
  _uid uuid := auth.uid();
  _key jsonb; _title text; _n int; _ok int := 0; _score int; _pct int; i int;
begin
  if _uid is null then raise exception 'not authenticated'; end if;
  select answer_key, title into _key, _title from exercises where id = _exercise_id and module = 'soz';
  if _key is null then raise exception 'exercise not found'; end if;
  _n := jsonb_array_length(_key);
  for i in 0.._n-1 loop
    if lower(trim(coalesce(_answers->>i,''))) = lower(trim(_key->>i)) then _ok := _ok + 1; end if;
  end loop;
  _score := case when _n = 0 then 0 else round(_ok * 100.0 / _n) end;
  insert into exercise_results(user_id, exercise_id, score, answers) values (_uid, _exercise_id, _score, _answers);
  insert into activity_log(user_id, module, title) values (_uid, 'soz', _title || ' — ' || _score || '%');
  select coalesce(round(avg(coalesce(best,0))),0) into _pct from (
    select e.id, (select max(score) from exercise_results r where r.exercise_id = e.id and r.user_id = _uid) best
    from exercises e where e.module = 'soz') t;
  insert into module_progress(user_id, module, percent, updated_at) values (_uid, 'soz', _pct, now())
    on conflict (user_id, module) do update set percent = excluded.percent, updated_at = now();
  return _score;
end; $$;
grant execute on function public.submit_exercise(uuid, jsonb) to authenticated;

create or replace function public.submit_text(_text_id uuid, _answers jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _title text; _pct int;
begin
  if _uid is null then raise exception 'not authenticated'; end if;
  select title into _title from texts where id = _text_id;
  if _title is null then raise exception 'text not found'; end if;
  insert into text_responses(user_id, text_id, answers) values (_uid, _text_id, _answers)
    on conflict (user_id, text_id) do update set answers = excluded.answers, created_at = now();
  insert into activity_log(user_id, module, title) values (_uid, 'matn', '“' || _title || '” matni tugallandi');
  select round(count(r.id) * 100.0 / greatest(count(t.id),1)) into _pct
    from texts t left join text_responses r on r.text_id = t.id and r.user_id = _uid;
  insert into module_progress(user_id, module, percent, updated_at) values (_uid, 'matn', _pct, now())
    on conflict (user_id, module) do update set percent = excluded.percent, updated_at = now();
end; $$;
grant execute on function public.submit_text(uuid, jsonb) to authenticated;

insert into public.vocab_items (word, category, definition, translation, cultural_note, example, related_phrases, related_proverbs) values
('Mehmondo‘stlik','madaniy','Mehmonni iliq kutib olish va izzat-hurmat ko‘rsatish odati.','Hospitality','O‘zbek madaniyatida mehmon eng hurmatli shaxs hisoblanadi; dasturxon har doim tayyor turadi.','Ularning mehmondo‘stligi barchani hayratda qoldirdi.','{"Dasturxon yozmoq","Xush kelibsiz"}','{"Mehmon otangdan ulug‘"}'),
('Dasturxon','bezekvivalent','Ovqat qo‘yiladigan mato; keng ma’noda — mehmon uchun tayyorlangan ziyofat.','Tablecloth / spread','Dasturxon muqaddas sanaladi, uni bosib o‘tish yoki non ushog‘ini tashlash odobsizlik.','Onam mehmonlar uchun dasturxon yozdi.','{"Dasturxon yozmoq","Dasturxonga fotiha qilmoq"}','{"Dasturxoning keng bo‘lsin"}'),
('Mahalla','bezekvivalent','Bir hududda yashovchi oilalarning o‘zini o‘zi boshqaruvchi jamoasi.','Neighbourhood community','Mahalla to‘y, ma’raka va hashar kabi tadbirlarni birgalikda o‘tkazadi.','Butun mahalla hasharga chiqdi.','{"Mahalla oqsoqoli"}','{"Qo‘shning tinch — sen tinch"}'),
('Hashar','bezekvivalent','Jamoa bo‘lib, beg‘araz bir ishni bajarish.','Communal voluntary work','Hashar o‘zaro yordam va birdamlik ramzi.','Uy qurilishi hashar bilan bitdi.','{"Hasharga chiqmoq"}','{"Ko‘pdan quyon qochib qutulmas"}'),
('Tilini tishlamoq','frazeologizm','Gapirishdan o‘zini tiymoq.','To hold one''s tongue','Kattalar huzurida ortiqcha gapirmaslik odob belgisi sanaladi.','U nimadir demoqchi edi, ammo tilini tishladi.','{"Og‘zini yummoq"}','{"Til — dil kaliti"}'),
('Non','madaniy','Bug‘doy unidan yopiladigan asosiy taom.','Bread','Non muqaddas: uni teskari qo‘yilmaydi, yo‘lga chiqqanga tishlatib qo‘yiladi.','Safarga chiqayotgan o‘g‘liga non tishlatishdi.','{"Non ushatmoq"}','{"Non — rizq, uni e’zozla"}');

insert into public.exercises (module, title, kind, questions, answer_key) values
('soz','Madaniy leksika: to‘g‘ri ma’noni tanlang','multiple_choice',
 '[{"prompt":"“Hashar” so‘zining ma’nosi qaysi?","options":["Jamoaviy beg‘araz ish","Bayram taomi","Uy jihozi","Musiqa asbobi"]},{"prompt":"“Dasturxon yozmoq” iborasi nimani bildiradi?","options":["Mehmon uchun ziyofat tayyorlamoq","Mato sotib olmoq","Xat yozmoq","Uy tozalamoq"]},{"prompt":"“Mahalla” so‘zining eng yaqin inglizcha tarjimasi?","options":["Neighbourhood community","Market","Family","School"]}]',
 '["Jamoaviy beg‘araz ish","Mehmon uchun ziyofat tayyorlamoq","Neighbourhood community"]'),
('soz','Maqolni to‘ldiring','fill_blank',
 '[{"prompt":"Mehmon otangdan ___."},{"prompt":"Qo‘shning tinch — sen ___."}]',
 '["ulug‘","tinch"]'),
('soz','Frazeologizmni ma’nosi bilan moslang','matching',
 '[{"prompt":"Tilini tishlamoq","options":["Gapirishdan o‘zini tiymoq","Ovqat yemoq","Kasal bo‘lmoq"]},{"prompt":"Non ushatmoq","options":["Birga ovqatlanib, do‘stlashmoq","Non yopmoq","Non sotmoq"]}]',
 '["Gapirishdan o‘zini tiymoq","Birga ovqatlanib, do‘stlashmoq"]');

insert into public.texts (title, source, body, context, key_words, notes, questions) values
('Mehmon kutish odati','O‘quv materiali (TRIALOG korpusi)',
 E'O‘zbek oilasida mehmon kelishi quvonchli voqea sanaladi. Mezbon mehmonni ostonada kutib oladi, qo‘lini ko‘ksiga qo‘yib salomlashadi va to‘rga taklif qiladi.\n\nDasturxonga avvalo non, choy va shirinliklar qo‘yiladi. Choyni mezbon o‘zi quyadi; piyolaga oz-ozdan quyish hurmat belgisi bo‘lib, mehmonning ko‘proq qolishini istashni anglatadi.\n\nMehmon ketayotganda uni darvozagacha kuzatib qo‘yish odat tusiga kirgan.',
 'Matn o‘zbek mehmondo‘stligi an’analarini ko‘rsatadi. Boshqa madaniyatlarda choyni to‘la quyish hurmat belgisi bo‘lishi mumkin — bu qiyosiy tahlil uchun muhim.',
 '{"to‘r","mezbon","piyola","ostona"}',
 '{"To‘r — xonaning eng hurmatli joyi, eshikdan eng uzoq tomon.","Choyni “qaytarish” — choyni piyolaga quyib, qayta choynakka qaytarish odati."}',
 '[{"type":"Faktik tushunish","prompt":"Mezbon mehmonni qayerga taklif qiladi?"},{"type":"Madaniy talqin","prompt":"Nima uchun piyolaga oz-ozdan choy quyiladi?"},{"type":"Qiyoslash","prompt":"Siz o‘rganayotgan tilning madaniyatida mehmon kutish qanday?"},{"type":"Shaxsiy talqin","prompt":"Siz uchun mehmondo‘stlikning eng muhim belgisi nima?"}]'),
('Navro‘z','O‘quv materiali (TRIALOG korpusi)',
 E'Navro‘z — bahor va yangi yil bayrami bo‘lib, 21-mart kuni nishonlanadi. Bu kunlarda odamlar bir-birlarini ziyorat qiladi, keksalardan xabar oladi va o‘zaro gina-kuduratlarni unutishga harakat qiladi.\n\nBayramning ramziy taomi — sumalak. U bug‘doy maysasidan tun bo‘yi qaynatib tayyorlanadi; qozon atrofida qo‘shiq aytiladi va niyat qilinadi.',
 'Navro‘z ko‘plab xalqlar uchun umumiy bayram; uni o‘rganilayotgan madaniyatning yangi yil an’analari bilan qiyoslash mumkin.',
 '{"sumalak","ziyorat","gina-kudurat"}',
 '{"Sumalak tayyorlash jamoaviy jarayon bo‘lib, mahalla ayollari birga qatnashadi."}',
 '[{"type":"Faktik tushunish","prompt":"Navro‘z qachon nishonlanadi?"},{"type":"Madaniy talqin","prompt":"Sumalak tayyorlash nima uchun jamoaviy jarayon?"},{"type":"Qiyoslash","prompt":"Boshqa madaniyatdagi yangi yil an’anasi bilan qiyoslang."},{"type":"Shaxsiy talqin","prompt":"Navro‘z siz uchun qanday ma’no kasb etadi?"}]');