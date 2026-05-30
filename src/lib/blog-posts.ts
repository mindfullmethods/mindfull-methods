export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  tags: string[];
};

const posts: BlogPost[] = [
  {
    slug: "how-mentorship-accelerates-your-career",
    title: "How structured mentorship accelerates your career",
    excerpt:
      "Why cohort-based mentorship beats self-paced tutorials when you need portfolio-ready skills and interview confidence.",
    publishedAt: "2026-05-01",
    author: "Mindfull Methods",
    tags: ["Mentorship", "Career"],
    content: `
Structured mentorship gives you three things self-paced learning rarely provides: accountability, feedback, and a clear milestone path.

At Mindfull Methods, each week has defined outcomes — not vague “watch module 4” tasks. You submit work, get mentor review, and iterate. That loop is what turns tutorials into portfolio pieces employers recognize.

If you are choosing between another video course and a mentorship track, ask: **Will I ship something real in 8 weeks?** If the answer matters, mentorship wins.
    `.trim(),
  },
  {
    slug: "choosing-the-right-course-track",
    title: "Choosing the right course track for your goals",
    excerpt:
      "Frontend, design, analytics, or full stack — a practical guide to matching your starting point with the right program.",
    publishedAt: "2026-05-10",
    author: "Mindfull Methods",
    tags: ["Courses", "Guide"],
    content: `
**Start with the outcome you want in 90 days.**

- **Frontend Engineering** — you want to ship UI in React/Next.js and land junior frontend roles.
- **Product Design** — you need a portfolio with research, wireframes, and polished case studies.
- **Data Analytics** — dashboards, SQL, and storytelling for business teams.
- **Full Stack** — connect frontend, APIs, and databases into one capstone.

Not sure? Book a free call on our contact page — we will recommend a track based on your background, not upsell the most expensive option.
    `.trim(),
  },
  {
    slug: "what-to-expect-in-week-one",
    title: "What to expect in week one of a Mindfull Methods cohort",
    excerpt:
      "Your first week sets the rhythm: orientation, baseline project, and your first mentor touchpoint.",
    publishedAt: "2026-05-20",
    author: "Mindfull Methods",
    tags: ["Students", "Onboarding"],
    content: `
Week one is about **alignment**, not perfection.

1. **Orientation** — course syllabus, tools setup, and how mentor sessions work.
2. **Baseline milestone** — a small deliverable so your mentor understands your starting level.
3. **Planning** — you leave week one with a clear checklist for week two.

Students who succeed treat week one as setup week: ask questions early, share blockers in your dashboard, and book your mentor check-in before the weekend.
    `.trim(),
  },
];

export function getBlogPosts() {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPost(slug: string) {
  return posts.find((post) => post.slug === slug) ?? null;
}

export function getBlogSlugs() {
  return posts.map((post) => post.slug);
}
