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
      "Why weekly mentor feedback beats self-paced tutorials when you need portfolio proof and interview confidence.",
    publishedAt: "2026-05-01",
    author: "Mindfull Methods",
    tags: ["Mentorship", "Career"],
    content: `
Structured mentorship gives you three things self-paced learning rarely provides: **accountability**, **feedback**, and a **clear milestone path**.

At Mindfull Methods, each week has defined outcomes — not vague “watch module 4” tasks. You submit work, get mentor review, and iterate. That loop is what turns tutorials into portfolio pieces employers recognize.

## Why feedback changes everything

When you learn alone, you often cannot tell whether your code, design, or analysis is “good enough.” A mentor shortens that uncertainty. Instead of spending three weeks on the wrong approach, you get a course correction in days.

Our students typically report the biggest jumps after week two — once they receive their first detailed review and refactor based on it.

## Accountability without burnout

Cohorts create gentle accountability. You know what week you are on, what is due, and who to ask when stuck. That structure reduces procrastination without requiring 40-hour weeks.

Plan for **5–8 hours per week** including project work and mentor touchpoints. The milestones flex around busy schedules — but they do not disappear.

## What to look for in a mentorship program

Before enrolling anywhere, ask:

1. Will I ship something real in 8–10 weeks?
2. Who reviews my work — a mentor or an automated quiz?
3. Is there a certificate or proof tied to completed milestones?

If the answer matters for your next role, mentorship wins over passive video courses.

## Ready to start?

Browse our [course tracks](/courses) or [book a free call](/contact) if you want help choosing the right path.
    `.trim(),
  },
  {
    slug: "choosing-the-right-course-track",
    title: "Choosing the right course track for your goals",
    excerpt:
      "Match prompt engineering, GenAI, agents, or automation to the outcome you want in the next 90 days.",
    publishedAt: "2026-05-10",
    author: "Mindfull Methods",
    tags: ["Courses", "Guide"],
    content: `
**Start with the outcome you want in 90 days** — not the technology that sounds impressive on LinkedIn.

## Match your goal to a track

| If you want to… | Start here |
|-----------------|------------|
| Write reliable prompts and evaluation loops for LLM features | [Prompt Engineering](/courses/prompt-engineering) |
| Build RAG apps and integrate GenAI APIs with a mentor-reviewed capstone | [Generative AI & LLMs](/courses/generative-ai-llms) |
| Ship multi-step agents with tools, memory, and guardrails | [AI Agents (Agentic AI)](/courses/ai-agents) |
| Automate ops with n8n, Make, and Zapier AI—no full app required | [AI Automation](/courses/ai-automation) |

## Beginner vs intermediate

**Beginner-friendly tracks** (Prompt Engineering, AI Automation) assume motivation and basic computer literacy—not years of prior AI experience.

**Intermediate tracks** (Generative AI & LLMs, AI Agents) expect comfort with APIs or light scripting. Mentors provide starter repos and step-by-step guidance.

## How we help you decide

Every inquiry gets a human response. We ask about your background, timeline, and target role — then recommend a track that fits, even if that means waiting for the next cohort or starting with a lighter program.

Not sure? [Book a free call](/contact) — no pressure to enroll on the spot.
    `.trim(),
  },
  {
    slug: "what-to-expect-in-week-one",
    title: "What to expect in week one of a Mindfull Methods cohort",
    excerpt:
      "Orientation, baseline deliverable, and your first mentor session — what actually happens after you enroll.",
    publishedAt: "2026-05-20",
    author: "Mindfull Methods",
    tags: ["Students", "Onboarding"],
    content: `
Week one is about **alignment**, not perfection. Here is exactly what happens after you enroll.

## Day 1–2: Orientation

- Access your dashboard and course syllabus (PDF + online view)
- Review weekly milestones and resource links for week one
- Set up tools for your track (GitHub, Figma, Python environment, etc.)

## Day 3–5: Baseline milestone

You complete a small deliverable so your mentor understands your starting level. This is not a test — it helps calibrate feedback so you are neither bored nor overwhelmed.

Examples by track:

- **Frontend:** a small React component with responsive layout
- **Design:** a problem statement and rough user flow
- **Analytics:** a metric definition and cleaned sample dataset

## End of week: Mentor check-in

Book your first mentor session from the course resources or contact page. Come with questions, blockers, and your baseline work. You leave with a clear checklist for week two.

## Tips from students who succeed

1. **Ask questions early** — use the contact form or dashboard if you are stuck more than 30 minutes.
2. **Submit something imperfect** — mentors cannot help with a blank page.
3. **Block 2–3 focused sessions** instead of cramming everything into one night.

## After week one

The rhythm repeats: milestone → review → iterate. By week four, most students say the process feels automatic.

[Open my courses](/login) after signup, or [explore programs](/courses) if you have not enrolled yet.
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
