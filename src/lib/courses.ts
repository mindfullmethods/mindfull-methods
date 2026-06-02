import { getCourseImage } from "@/lib/images";

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
  priceInPaise: number;
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
    priceLabel: "₹12,999 · Cohort-based",
    priceInPaise: 1299900,
    tags: ["React", "Next.js", "Tailwind", "Projects"],
    imageUrl: getCourseImage("frontend-engineering"),
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
    priceLabel: "₹12,999 · Cohort-based",
    priceInPaise: 1299900,
    tags: ["Research", "Figma", "Design systems", "Case studies"],
    imageUrl: getCourseImage("product-design"),
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
    priceLabel: "₹12,999 · Cohort-based",
    priceInPaise: 1299900,
    tags: ["Dashboards", "SQL", "Storytelling", "Projects"],
    imageUrl: getCourseImage("data-analytics"),
    featured: true,
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
  {
    id: "fs-fullstack",
    slug: "full-stack-development",
    title: "Full Stack Development",
    shortDescription: "Ship end-to-end apps with React, Node.js, databases, and deployment workflows.",
    longDescription:
      "Learn how modern full stack products are built—from UI to API to database. You’ll follow a milestone-driven path with mentor reviews on architecture, security basics, and deployment readiness.",
    level: "Intermediate",
    duration: "10 weeks",
    mode: "Hybrid",
    priceLabel: "₹14,999 · Cohort-based",
    priceInPaise: 1499900,
    tags: ["React", "Node.js", "PostgreSQL", "APIs"],
    imageUrl: getCourseImage("full-stack-development"),
    featured: true,
    learnOutcomes: [
      "Design RESTful APIs and connect them to a React frontend",
      "Model data with PostgreSQL and write safe queries",
      "Implement authentication and protected routes",
      "Deploy a full stack capstone to production",
    ],
    curriculum: [
      { week: "Week 1", topics: ["Full stack overview", "Project setup", "Git workflow"] },
      { week: "Week 2", topics: ["React patterns", "Forms & state", "API integration"] },
      { week: "Week 3", topics: ["Node.js basics", "Express routing", "Middleware"] },
      { week: "Week 4", topics: ["Database design", "PostgreSQL", "Migrations"] },
      { week: "Week 5", topics: ["Auth flows", "Sessions & tokens", "Security basics"] },
      { week: "Week 6", topics: ["Capstone planning", "Architecture review", "Milestone 1"] },
      { week: "Week 7", topics: ["Capstone build", "Code review", "Refactoring"] },
      { week: "Week 8", topics: ["Testing basics", "Error handling", "Logging"] },
      { week: "Week 9", topics: ["Deployment", "Environment config", "Monitoring intro"] },
      { week: "Week 10", topics: ["Final demo", "Portfolio write-up", "Career next steps"] },
    ],
    faqs: [
      {
        question: "Do I need backend experience?",
        answer: "Basic JavaScript knowledge is enough. Mentors will guide you through backend concepts step by step.",
      },
      {
        question: "What will I deploy?",
        answer: "A capstone app with a React frontend, API layer, and database—hosted on a modern platform.",
      },
    ],
  },
  {
    id: "dm-marketing",
    slug: "digital-marketing",
    title: "Digital Marketing",
    shortDescription: "Learn SEO, content, ads, and analytics with campaign-based mentorship.",
    longDescription:
      "Build practical marketing skills through guided campaigns. You’ll learn how to plan, execute, measure, and present results—the way real growth teams work.",
    level: "Beginner Friendly",
    duration: "6 weeks",
    mode: "Online",
    priceLabel: "₹9,999 · Cohort-based",
    priceInPaise: 999900,
    tags: ["SEO", "Content", "Ads", "Analytics"],
    imageUrl: getCourseImage("digital-marketing"),
    featured: false,
    learnOutcomes: [
      "Plan a multi-channel campaign with clear goals and KPIs",
      "Write content optimized for search and conversion",
      "Set up and read basic ad and analytics dashboards",
      "Present a campaign case study with measurable outcomes",
    ],
    curriculum: [
      { week: "Week 1", topics: ["Marketing fundamentals", "Audience & positioning", "KPI design"] },
      { week: "Week 2", topics: ["SEO basics", "Keyword research", "On-page optimization"] },
      { week: "Week 3", topics: ["Content strategy", "Copy frameworks", "Publishing cadence"] },
      { week: "Week 4", topics: ["Paid ads intro", "Budgeting", "Creative testing"] },
      { week: "Week 5", topics: ["Analytics", "Reporting", "Iteration loops"] },
      { week: "Week 6", topics: ["Campaign capstone", "Presentation", "Mentor review"] },
    ],
    faqs: [
      {
        question: "Is this for complete beginners?",
        answer: "Yes. We start with fundamentals and build toward a portfolio-ready campaign case study.",
      },
      {
        question: "Will I run real ads?",
        answer: "You’ll learn campaign setup and measurement. Optional small-budget exercises can be done with mentor guidance.",
      },
    ],
  },
  {
    id: "ml-basics",
    slug: "machine-learning",
    title: "Machine Learning Foundations",
    shortDescription: "Build intuition for ML models, Python workflows, and real-world project delivery.",
    longDescription:
      "A project-first introduction to machine learning. You’ll work with Python, explore common algorithms, and finish with a mentor-reviewed capstone you can explain to technical and non-technical audiences.",
    level: "Intermediate",
    duration: "8 weeks",
    mode: "Online",
    priceLabel: "₹16,999 · Cohort-based",
    priceInPaise: 1699900,
    tags: ["Python", "Scikit-learn", "Models", "Projects"],
    imageUrl: getCourseImage("machine-learning"),
    featured: true,
    learnOutcomes: [
      "Prepare datasets and evaluate model performance responsibly",
      "Train and compare common ML algorithms for tabular data",
      "Explain model results to stakeholders in plain language",
      "Deliver a capstone notebook and presentation",
    ],
    curriculum: [
      { week: "Week 1", topics: ["ML landscape", "Python refresh", "Data exploration"] },
      { week: "Week 2", topics: ["Feature engineering", "Train/test splits", "Baselines"] },
      { week: "Week 3", topics: ["Regression models", "Evaluation metrics", "Error analysis"] },
      { week: "Week 4", topics: ["Classification", "Confusion matrix", "Threshold tuning"] },
      { week: "Week 5", topics: ["Model selection", "Cross-validation", "Overfitting"] },
      { week: "Week 6", topics: ["Capstone scoping", "Milestone review", "Ethics basics"] },
      { week: "Week 7", topics: ["Capstone build", "Mentor feedback", "Iteration"] },
      { week: "Week 8", topics: ["Final presentation", "Portfolio packaging", "Next steps"] },
    ],
    faqs: [
      {
        question: "What math background do I need?",
        answer: "High-school algebra and comfort with numbers is enough. We focus on intuition and application first.",
      },
      {
        question: "Do I need a GPU?",
        answer: "No. The course uses lightweight datasets and tools that run on a standard laptop.",
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

export function normalizeCourseSlug(slug: string) {
  return normalizeSlug(slug);
}

export function getCourseBySlug(slug: string) {
  const normalized = normalizeSlug(slug);
  return courses.find((c) => c.slug === normalized) ?? null;
}

export function getCourseSlugs() {
  return courses.map((c) => c.slug);
}

