# Mindfull Methods

A full-stack mentorship and internship platform built with Next.js, TypeScript, Tailwind CSS, Supabase, and Vercel.

**Live site:** https://mindfull-methods.vercel.app

---

## Features

### Marketing site
- Home, courses catalog (search + filters), course detail pages
- About, contact, privacy, terms, custom 404
- SEO: metadata, sitemap, robots.txt, Open Graph
- Contact form with Resend email delivery
- Syllabus download per course

### Student platform
- Supabase authentication (login / signup)
- Dashboard: internships, applications, admin studio
- Course-aware signup flow (`/signup?course=slug`)

---

## Tech stack

| Layer | Tools |
|-------|-------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Supabase (auth + PostgreSQL), Next.js API routes |
| Email | Resend |
| Hosting | Vercel + Analytics |

---

## Local setup

```bash
git clone https://github.com/mindfullmethods/mindfull-methods.git
cd mindfull-methods
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=your_resend_key          # optional locally
CONTACT_TO_EMAIL=support@mindfullmethods.com
CONTACT_FROM_EMAIL=onboarding@resend.dev
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

1. Push to GitHub (connected to Vercel)
2. Add the same env vars in **Vercel → Settings → Environment Variables**
3. Set `NEXT_PUBLIC_SITE_URL` to your production URL
4. Redeploy after changing env vars

### Required env vars (production)

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `NEXT_PUBLIC_SITE_URL` | Yes |
| `RESEND_API_KEY` | For contact emails |
| `CONTACT_TO_EMAIL` | For contact emails |
| `CONTACT_FROM_EMAIL` | For contact emails |

---

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## Project structure

```
src/
├── app/
│   ├── (marketing)/     # Public site pages
│   ├── (auth)/          # Login & signup
│   ├── dashboard/       # Student & admin dashboard
│   └── api/             # Contact & syllabus APIs
├── components/
│   ├── marketing/       # Navbar, Footer, course cards, etc.
│   └── components/      # Dashboard UI
└── lib/                 # Courses, email, site config
public/
└── brand-assets/        # Logo files
```

---

## License

Private — Mindfull Methods
