create type user_role as enum ('student', 'instructor', 'admin');
create type payment_status as enum ('created', 'paid', 'failed', 'refunded');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  email text not null unique,
  role user_role not null default 'student',
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric(12, 2) not null default 0,
  thumbnail text,
  level text not null,
  duration text not null,
  assigned_instructor_id uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  video_url text,
  notes_url text,
  duration text,
  sort_order integer not null default 0
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  timer_seconds integer not null default 600,
  passing_score integer not null default 70
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null,
  answer text not null
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  due_at timestamptz
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  github_link text,
  project_url text,
  file_url text,
  grade numeric(5, 2),
  feedback text,
  submitted_at timestamptz not null default now()
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_number text not null unique,
  user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  issue_date date not null default current_date,
  verification_url text not null
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  amount numeric(12, 2) not null,
  payment_status payment_status not null default 'created',
  razorpay_payment_id text,
  razorpay_order_id text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.certificates enable row level security;
alter table public.payments enable row level security;

create policy "courses are readable by authenticated users" on public.courses for select using (auth.role() = 'authenticated');
create policy "students read own enrollments" on public.enrollments for select using (user_id in (select id from public.users where auth_user_id = auth.uid()));
create policy "students update own progress" on public.progress for all using (user_id in (select id from public.users where auth_user_id = auth.uid()));
create policy "students manage own submissions" on public.submissions for all using (student_id in (select id from public.users where auth_user_id = auth.uid()));
create policy "public certificate verification" on public.certificates for select using (true);
