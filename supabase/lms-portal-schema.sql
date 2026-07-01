-- LMS portal (run after migration #14). Prefixed tables avoid clashing with enrollments / course_certificates.

do $$ begin
  create type lms_user_role as enum ('student', 'instructor', 'admin');
exception when duplicate_object then null;
end $$;

create table if not exists public.lms_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  role lms_user_role not null default 'student',
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.lms_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  price_inr numeric(12, 2) not null default 0,
  thumbnail text,
  level text not null,
  duration text not null,
  assigned_instructor_id uuid references public.lms_profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.lms_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses (id) on delete cascade,
  title text not null,
  sort_order integer not null default 0
);

create table if not exists public.lms_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.lms_modules (id) on delete cascade,
  title text not null,
  video_url text,
  notes_url text,
  duration text,
  sort_order integer not null default 0
);

create table if not exists public.lms_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  course_slug text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

create table if not exists public.lms_quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null,
  title text not null,
  timer_seconds integer not null default 600,
  passing_score integer not null default 70
);

create table if not exists public.lms_quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.lms_quizzes (id) on delete cascade,
  question text not null,
  options jsonb not null,
  answer text not null
);

create table if not exists public.lms_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.lms_quizzes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  score_percent integer not null,
  passed boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lms_assignments (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null,
  title text not null,
  due_at timestamptz
);

create table if not exists public.lms_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.lms_assignments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  github_link text,
  project_url text,
  file_url text,
  grade numeric(5, 2),
  feedback text,
  submitted_at timestamptz not null default now()
);

create index if not exists lms_lesson_progress_user_idx on public.lms_lesson_progress (user_id);
create index if not exists lms_courses_slug_idx on public.lms_courses (slug);

alter table public.lms_profiles enable row level security;
alter table public.lms_courses enable row level security;
alter table public.lms_modules enable row level security;
alter table public.lms_lessons enable row level security;
alter table public.lms_lesson_progress enable row level security;
alter table public.lms_quizzes enable row level security;
alter table public.lms_quiz_questions enable row level security;
alter table public.lms_quiz_attempts enable row level security;
alter table public.lms_assignments enable row level security;
alter table public.lms_submissions enable row level security;

drop policy if exists "lms courses readable" on public.lms_courses;
create policy "lms courses readable" on public.lms_courses for select to authenticated using (true);

drop policy if exists "lms modules readable" on public.lms_modules;
create policy "lms modules readable" on public.lms_modules for select to authenticated using (true);

drop policy if exists "lms lessons readable" on public.lms_lessons;
create policy "lms lessons readable" on public.lms_lessons for select to authenticated using (true);

drop policy if exists "lms progress own" on public.lms_lesson_progress;
create policy "lms progress own" on public.lms_lesson_progress for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lms quizzes readable" on public.lms_quizzes;
create policy "lms quizzes readable" on public.lms_quizzes for select to authenticated using (true);

drop policy if exists "lms quiz questions readable" on public.lms_quiz_questions;
create policy "lms quiz questions readable" on public.lms_quiz_questions for select to authenticated using (true);

drop policy if exists "lms quiz attempts own" on public.lms_quiz_attempts;
create policy "lms quiz attempts own" on public.lms_quiz_attempts for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lms assignments readable" on public.lms_assignments;
create policy "lms assignments readable" on public.lms_assignments for select to authenticated using (true);

drop policy if exists "lms submissions own" on public.lms_submissions;
create policy "lms submissions own" on public.lms_submissions for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lms profiles own read" on public.lms_profiles;
create policy "lms profiles own read" on public.lms_profiles for select to authenticated
  using (auth.uid() = auth_user_id);

-- Seed four AI programs (idempotent)
insert into public.lms_courses (slug, title, description, price_inr, level, duration, thumbnail)
values
  (
    'prompt-engineering',
    'Prompt Engineering',
    'Design reliable prompts, evaluation workflows, and business-ready AI communication.',
    9999,
    'Beginner Friendly',
    '6 weeks',
    '/images/courses/prompt-engineering.jpg'
  ),
  (
    'generative-ai-llms',
    'Generative AI & LLMs',
    'Build with APIs, embeddings, RAG, and fine-tuning basics.',
    12999,
    'Intermediate',
    '8 weeks',
    '/images/courses/generative-ai-llms.jpg'
  ),
  (
    'ai-agents',
    'AI Agents (Agentic AI)',
    'Design multi-step AI agents with tools, memory, planning, and guardrails.',
    14999,
    'Advanced',
    '8 weeks',
    '/images/courses/ai-agents.jpg'
  ),
  (
    'ai-automation',
    'AI Automation (n8n, Make, Zapier AI)',
    'Automate operations with agents, triggers, data connectors, and quality checks.',
    12999,
    'Intermediate',
    '6 weeks',
    '/images/courses/ai-automation.jpg'
  )
on conflict (slug) do nothing;

insert into public.lms_quizzes (lesson_id, title, timer_seconds, passing_score)
select 'prompt-engineering-m0-l0', 'Prompt Engineering Quiz', 600, 70
where not exists (select 1 from public.lms_quizzes where lesson_id = 'prompt-engineering-m0-l0');

insert into public.lms_quiz_questions (quiz_id, question, options, answer)
select q.id,
  'What is a prompt template?',
  '["A reusable instruction pattern", "A payment gateway response", "A database migration", "A video hosting endpoint"]'::jsonb,
  'A reusable instruction pattern'
from public.lms_quizzes q
where q.lesson_id = 'prompt-engineering-m0-l0'
  and not exists (select 1 from public.lms_quiz_questions where quiz_id = q.id);

notify pgrst, 'reload schema';
