export type CourseFaq = {
  question: string;
  answer: string;
};

export type CourseCurriculumItem = {
  week: string;
  topics: string[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  level: string;
  duration: string;
  mode: "Online" | "Hybrid";
  priceLabel: string;
  tags: string[];
  imageUrl: string;
  featured: boolean;
  learnOutcomes: string[];
  curriculum: CourseCurriculumItem[];
  faqs: CourseFaq[];
};

const courses: Course[] = [
  {
    id: "fe-frontend",
    slug: "frontend-engineering",
    title: "Frontend Engineering",
    shortDescription: "Build portfolio-grade UI with React, Next.js, and modern best practices.",
    longDescription:
      "A mentorship-led course designed to take you from fundamentals to polished, production-ready frontends. You’ll ship guided projects, get code reviews, and learn how to think like a UI engineer.",
    level: "Beginner Friendly",
    duration: "8 weeks",
    mode: "Online",
    priceLabel: "Cohort-based · Apply to join",
    tags: ["React", "Next.js", "Tailwind", "Projects"],
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=60",
    featured: true,
    learnOutcomes: [
      "Build reusable UI components with accessibility in mind",
      "Create performant pages with Next.js routing and data patterns",
      "Design consistent styles using tokens and component variants",
      "Ship a capstone project with a polished demo-ready README",
    ],
    curriculum: [
      { week: "Week 1", topics: ["JS + React refresh", "Component patterns", "State & effects"] },
      { week: "Week 2", topics: ["Styling systems", "Responsive layouts", "Tailwind component design"] },
      { week: "Week 3", topics: ["Next.js fundamentals", "Routing basics", "Forms & validation UX"] },
      { week: "Week 4", topics: ["Reusable UI patterns", "Modals & composition", "Performance basics"] },
      { week: "Week 5", topics: ["Capstone planning", "Project architecture", "Designing user flows"] },
      { week: "Week 6", topics: ["Capstone build", "Milestone feedback", "Iterate & refactor"] },
      { week: "Week 7", topics: ["Polish phase", "Accessibility improvements", "Testing strategy"] },
      { week: "Week 8", topics: ["Final demo", "Portfolio packaging", "Next steps mentorship"] },
    ],
    faqs: [
      {
        question: "Do I need previous React experience?",
        answer:
          "No. This track is designed for beginner-friendly learners. If you’ve written basic JavaScript, you’ll be fine—mentors will help you ramp up quickly.",
      },
      {
        question: "How mentorship works during the course?",
        answer:
          "You’ll get weekly mentor sessions plus code-review style feedback on your project milestones. You’ll also receive targeted guidance when you get stuck.",
      },
      {
        question: "Will there be a final project?",
        answer:
          "Yes. You’ll complete a capstone project and package it into a portfolio-ready demo.",
      },
    ],
  },
  {
    id: "pd-product",
    slug: "product-design",
    title: "Product Design",
    shortDescription: "Learn research, visual systems, and product storytelling with mentorship.",
    longDescription:
      "A structured design track that helps you move beyond theory. You’ll practice research, create wireframes, develop a coherent visual system, and present polished case studies—with feedback at every step.",
    level: "Portfolio Track",
    duration: "6 weeks",
    mode: "Online",
    priceLabel: "Cohort-based · Apply to join",
    tags: ["Research", "Figma", "Design systems", "Case studies"],
    imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=60",
    featured: true,
    learnOutcomes: [
      "Conduct lightweight UX research and translate findings into design decisions",
      "Build wireframes and iterate with feedback loops",
      "Develop a simple design system with consistent components",
      "Create a case-study narrative that recruiters understand",
    ],
    curriculum: [
      { week: "Week 1", topics: ["Problem framing", "User needs", "Research plan"] },
      { week: "Week 2", topics: ["Wireframing", "User flows", "Rapid iteration"] },
      { week: "Week 3", topics: ["Visual design", "Typography & layout", "Component thinking"] },
      { week: "Week 4", topics: ["Design system", "Tokens & variants", "Consistency checks"] },
      { week: "Week 5", topics: ["Case study draft", "Story structure", "Review & revise"] },
      { week: "Week 6", topics: ["Final polish", "Portfolio packaging", "Mentor Q&A"] },
    ],
    faqs: [
      {
        question: "Do I need to be an expert in Figma?",
        answer:
          "No. You’ll learn the workflow we use in the course. If you already know Figma basics, you’ll progress faster, but both paths work.",
      },
      {
        question: "What will I have at the end?",
        answer:
          "A portfolio-ready case study with a documented process, plus a small design system you can reuse.",
      },
    ],
  },
  {
    id: "da-analytics",
    slug: "data-analytics",
    title: "Data Analytics",
    shortDescription: "Turn datasets into dashboards and clear business insights.",
    longDescription:
      "This track focuses on practical analysis: from cleaning and interpreting data to communicating results. You’ll learn how to build dashboards that stakeholders actually use—and you’ll iterate with mentor feedback.",
    level: "Project Based",
    duration: "7 weeks",
    mode: "Online",
    priceLabel: "Cohort-based · Apply to join",
    tags: ["Dashboards", "SQL", "Storytelling", "Projects"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60",
    featured: false,
    learnOutcomes: [
      "Ask better questions and define metrics that matter",
      "Clean and transform data for analysis",
      "Build stakeholder-friendly dashboards",
      "Communicate insights with clarity and confidence",
    ],
    curriculum: [
      { week: "Week 1", topics: ["Analytics mindset", "Metric design", "Data overview"] },
      { week: "Week 2", topics: ["Data cleaning", "Transform steps", "Quality checks"] },
      { week: "Week 3", topics: ["SQL fundamentals", "Query patterns", "Aggregations"] },
      { week: "Week 4", topics: ["Dashboard design", "Chart selection", "Narrative building"] },
      { week: "Week 5", topics: ["Insight iteration", "Mentor feedback", "Refine metrics"] },
      { week: "Week 6", topics: ["Final dashboard", "Packaging", "Stakeholder walkthrough"] },
      { week: "Week 7", topics: ["Capstone presentation", "Portfolio outputs", "Next steps"] },
    ],
    faqs: [
      {
        question: "Will I write SQL from day one?",
        answer:
          "You’ll start with the fundamentals and build upward. Mentors will provide structured guidance so you can ramp safely.",
      },
      {
        question: "Do we work with real datasets?",
        answer:
          "Yes. You’ll use realistic datasets and practice turning messy data into usable insights.",
      },
    ],
  },
];

export function getCourses() {
  return courses;
}

export function getFeaturedCourses() {
  return courses.filter((c) => c.featured);
}

function normalizeSlug(slug: string) {
  if (!slug) return "";
  return slug.trim().toLowerCase().replace(/_/g, "-");
}

export function getCourseBySlug(slug: string) {
  const normalized = normalizeSlug(slug);
  return courses.find((c) => c.slug === normalized) ?? null;
}

export function getCourseSlugs() {
  return courses.map((c) => c.slug);
}

