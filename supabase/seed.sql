-- seed.sql — демо-данные для аккаунта demo@minicrm.app.
-- Запускать в SQL Editor ПОСЛЕ создания демо-пользователя (Authentication → Add user, Auto Confirm).
-- Идемпотентно: сносит прежние данные этого юзера (каскадом deals+activities) и вставляет заново.
-- Пользователь ищется по email — хардкода UUID нет.

do $$
declare
  demo_id uuid;
  -- фиксированные id клиентов, чтобы ссылаться из deals/activities
  c1  uuid := '0a000000-0000-4000-8000-000000000001';
  c2  uuid := '0a000000-0000-4000-8000-000000000002';
  c3  uuid := '0a000000-0000-4000-8000-000000000003';
  c4  uuid := '0a000000-0000-4000-8000-000000000004';
  c5  uuid := '0a000000-0000-4000-8000-000000000005';
  c6  uuid := '0a000000-0000-4000-8000-000000000006';
  c7  uuid := '0a000000-0000-4000-8000-000000000007';
  c8  uuid := '0a000000-0000-4000-8000-000000000008';
  c9  uuid := '0a000000-0000-4000-8000-000000000009';
  c10 uuid := '0a000000-0000-4000-8000-000000000010';
  c11 uuid := '0a000000-0000-4000-8000-000000000011';
  c12 uuid := '0a000000-0000-4000-8000-000000000012';
begin
  select id into demo_id from auth.users where email = 'demo@minicrm.app';
  if demo_id is null then
    raise exception 'Демо-пользователь demo@minicrm.app не найден. Сначала создай его в Authentication.';
  end if;

  -- Имя в профиле (триггер создал профиль с пустым full_name).
  update public.profiles set full_name = 'Demo User' where id = demo_id;

  -- Очистка прежних демо-данных (deals/activities уйдут каскадом).
  delete from public.clients where user_id = demo_id;

  -- === Клиенты (created_at разнесён по месяцам 2026 для графика динамики) ===
  insert into public.clients (id, user_id, name, company, email, phone, status, created_at, updated_at) values
    (c1,  demo_id, 'John Carter',    'Acme Corp',          'john@acme.io',        '+1 415 555 0101', 'active',   '2026-01-12', '2026-01-12'),
    (c2,  demo_id, 'Sarah Mitchell', 'Globex Ltd',         'sarah@globex.com',    '+1 415 555 0102', 'active',   '2026-01-28', '2026-01-28'),
    (c3,  demo_id, 'David Kim',      'Initech',            'david@initech.com',   '+1 415 555 0103', 'lead',     '2026-02-09', '2026-02-09'),
    (c4,  demo_id, 'Emma Wilson',    'Umbrella Inc',       'emma@umbrella.co',    '+1 415 555 0104', 'active',   '2026-02-21', '2026-02-21'),
    (c5,  demo_id, 'Robert Hughes',  'Stark Industries',   'robert@stark.com',    '+1 415 555 0105', 'active',   '2026-03-05', '2026-03-05'),
    (c6,  demo_id, 'Laura Bennett',  'Wayne Enterprises',  'laura@wayne.com',     '+1 415 555 0106', 'lead',     '2026-03-22', '2026-03-22'),
    (c7,  demo_id, 'Michael Turner', 'Soylent Corp',       'michael@soylent.io',  '+1 415 555 0107', 'inactive', '2026-04-14', '2026-04-14'),
    (c8,  demo_id, 'Priya Sharma',   'Hooli',              'priya@hooli.com',     '+1 415 555 0108', 'lead',     '2026-05-03', '2026-05-03'),
    (c9,  demo_id, 'Tom Anderson',   'Pied Piper',         'tom@piedpiper.com',   '+1 415 555 0109', 'active',   '2026-05-19', '2026-05-19'),
    (c10, demo_id, 'Nina Rossi',     'Vehement Capital',   'nina@vehement.com',   '+1 415 555 0110', 'inactive', '2026-06-07', '2026-06-07'),
    (c11, demo_id, 'James Park',     'Massive Dynamic',    'james@massive.com',   '+1 415 555 0111', 'inactive', '2026-06-25', '2026-06-25'),
    (c12, demo_id, 'Olivia Grant',   'Cyberdyne Systems',  'olivia@cyberdyne.io', '+1 415 555 0112', 'lead',     '2026-07-11', '2026-07-11');

  -- === Сделки (по этапам: new/negotiation/won/lost) ===
  insert into public.deals (user_id, client_id, title, amount, stage, expected_close_date, created_at, updated_at) values
    (demo_id, c1,  'Website redesign',      12000, 'won',         '2026-03-01', '2026-01-20', '2026-03-01'),
    (demo_id, c1,  'Design system',         22000, 'negotiation', '2026-08-15', '2026-06-10', '2026-06-10'),
    (demo_id, c2,  'Mobile app MVP',        25000, 'negotiation', '2026-08-30', '2026-02-02', '2026-02-02'),
    (demo_id, c2,  'Cloud migration',       30000, 'new',         '2026-09-20', '2026-07-01', '2026-07-01'),
    (demo_id, c3,  'SEO retainer',           6000, 'new',         '2026-08-10', '2026-02-15', '2026-02-15'),
    (demo_id, c4,  'Dashboard build',       18000, 'won',         '2026-04-05', '2026-02-25', '2026-04-05'),
    (demo_id, c5,  'API integration',        9000, 'negotiation', '2026-08-20', '2026-03-10', '2026-03-10'),
    (demo_id, c5,  'Performance audit',      4500, 'won',         '2026-04-18', '2026-03-18', '2026-04-18'),
    (demo_id, c6,  'E-commerce platform',   40000, 'new',         '2026-10-01', '2026-03-28', '2026-03-28'),
    (demo_id, c7,  'Branding package',       5000, 'lost',        '2026-05-01', '2026-04-16', '2026-05-01'),
    (demo_id, c8,  'Landing page',           3000, 'won',         '2026-06-01', '2026-05-05', '2026-06-01'),
    (demo_id, c9,  'CRM customization',     15000, 'negotiation', '2026-08-25', '2026-05-22', '2026-05-22'),
    (demo_id, c9,  'Chatbot integration',    9500, 'new',         '2026-09-05', '2026-07-05', '2026-07-05'),
    (demo_id, c10, 'Data migration',         8000, 'lost',        '2026-06-15', '2026-06-09', '2026-06-15'),
    (demo_id, c11, 'Support contract',       7000, 'lost',        '2026-07-01', '2026-06-27', '2026-07-01'),
    (demo_id, c12, 'Analytics setup',       11000, 'new',         '2026-09-15', '2026-07-14', '2026-07-14');

  -- === Активности (call/email/meeting/note) ===
  insert into public.activities (user_id, client_id, type, content, created_at) values
    (demo_id, c1,  'call',    'Kickoff call — discussed redesign scope and timeline.',   '2026-07-10'),
    (demo_id, c1,  'email',   'Sent proposal and homepage mockups for review.',          '2026-07-12'),
    (demo_id, c1,  'note',    'Client prefers a minimal, high-contrast visual style.',   '2026-06-30'),
    (demo_id, c2,  'meeting', 'Sprint review — demoed the MVP navigation flow.',         '2026-07-15'),
    (demo_id, c2,  'email',   'Shared the updated delivery timeline for the app.',        '2026-07-08'),
    (demo_id, c3,  'call',    'Intro call — outlined SEO retainer options.',             '2026-07-03'),
    (demo_id, c4,  'note',    'Dashboard delivered; awaiting final sign-off.',           '2026-06-20'),
    (demo_id, c5,  'meeting', 'Technical sync on the API integration endpoints.',        '2026-07-16'),
    (demo_id, c5,  'email',   'Sent the performance audit report (score 92/100).',       '2026-04-18'),
    (demo_id, c6,  'call',    'Discovery call for the e-commerce platform.',             '2026-07-18'),
    (demo_id, c6,  'note',    'Budget approval expected next quarter.',                  '2026-07-19'),
    (demo_id, c7,  'email',   'Followed up on the branding package — no response.',      '2026-05-10'),
    (demo_id, c8,  'call',    'Quick call — the landing page is now live.',              '2026-06-01'),
    (demo_id, c9,  'meeting', 'Scoping session for the CRM customization project.',      '2026-07-14'),
    (demo_id, c9,  'note',    'Wants Slack + email notifications in v2.',                '2026-07-17'),
    (demo_id, c10, 'email',   'Closing note — data migration is on hold.',               '2026-06-15'),
    (demo_id, c11, 'call',    'Contract not renewed; account archived.',                 '2026-06-27'),
    (demo_id, c12, 'meeting', 'Analytics setup — defined the key events to track.',      '2026-07-20');

  raise notice 'Seed готов: 12 клиентов, 16 сделок, 18 активностей для %.', demo_id;
end $$;
