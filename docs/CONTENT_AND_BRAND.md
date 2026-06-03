# Content & brand checklist (your track)

Use this while engineering handles features/deploy. No code required for most items.

## Images (`public/images/`)

| File | Where it shows |
|------|----------------|
| `marketing/hero.jpg` | Home hero |
| `marketing/mentor-rajiv.jpg` | About + Site & promos default |
| `marketing/auth-collaboration.jpg` | Login panel |
| `marketing/auth-dashboard.jpg` | Signup panel |
| `marketing/dashboard-preview.jpg` | Home preview |
| `marketing/internship-fallback.jpg` | Internship cards |
| `courses/prompt-engineering.jpg` | Prompt Engineering card |
| `courses/generative-ai-llms.jpg` | Generative AI & LLMs card |
| `courses/ai-agents.jpg` | AI Agents card |
| `courses/ai-automation.jpg` | AI Automation card |

Target: WebP/JPG under ~400 KB. Mentor: ~800×800 or 4:5.

## Admin copy (no redeploy)

1. **`/dashboard/admin/site`** — home stats, testimonials, mentor URL, promo codes  
2. **`/dashboard/admin/content`** — course titles, pricing blurbs, blog posts  
3. **`/dashboard/admin`** — internship listings + image upload or URL  

## Syllabi PDFs

```bash
npm run syllabi:generate
```

Outputs `public/syllabi/{slug}.pdf` for course **Download PDF** buttons.

## SEO & analytics

- `NEXT_PUBLIC_SITE_URL` — production domain when live  
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 (optional)  
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — Search Console (optional)  

## Quick verify

With `npm run dev` running:

```bash
npm run smoke
```

Spot-check home, about, one course, contact, login (course-focused copy).
