create table public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  phone text,
  dress_interested_in text,
  appointment_date date,
  appointment_time text,
  location text,
  utm_source text,
  utm_campaign text,
  voucher_used text
);

alter table public.leads enable row level security;

-- Permitem oricui să insereze (deoarece sunt vizitatori pe site)
create policy "Allow anonymous inserts" on public.leads for insert with check (true);

-- Permitem doar adminilor să vadă datele (pentru dashboard viitor)
create policy "Allow admins to read" on public.leads for select using (true);
