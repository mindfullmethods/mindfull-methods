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
    id: "pe-prompt",
    slug: "prompt-engineering",
    title: "Prompt Engineering",
    shortDescription: "Design reliable prompts, evaluate outputs, and ship AI workflows mentors can review.",
    longDescription:
      "Master the craft of working with large language models: clear instructions, few-shot patterns, structured outputs, guardrails, and evaluation loops. You will build reusable prompt libraries and small automations each week—with mentor feedback until your capstone demonstrates production-grade prompt design, not random trial and error.",
    level: "Beginner Friendly",
    duration: "6 weeks",
    mode: "Online",
    priceLabel: "₹9,999 · Cohort-based",
    priceInPaise: 999900,
    tags: ["LLMs", "Prompts", "Evaluation", "Workflows"],
    imageUrl: getCourseImage("prompt-engineering"),
    featured: true,
    learnOutcomes: [
      "Write system and user prompts that behave consistently across models",
      "Use few-shot examples, JSON schema outputs, and chain-of-thought responsibly",
      "Build evaluation sets and score outputs before shipping to users",
      "Package a capstone prompt playbook for a real use case",
    ],
    curriculum: [
      { week: "Week 1", topics: ["LLM basics", "Tokens & context", "Instruction design"] },
      { week: "Week 2", topics: ["Few-shot patterns", "Role prompts", "Output formatting"] },
      { week: "Week 3", topics: ["Structured outputs", "JSON mode", "Validation loops"] },
      { week: "Week 4", topics: ["RAG overview", "Grounding prompts", "Citation habits"] },
      { week: "Week 5", topics: ["Eval harnesses", "Regression tests", "Cost & latency"] },
      { week: "Week 6", topics: ["Capstone playbook", "Mentor review", "Portfolio demo"] },
    ],
    faqs: [
      {
        question: "Do I need to code?",
        answer:
          "Light scripting helps but is not required week one. We focus on prompt design first; optional Python snippets are provided for evaluations.",
      },
      {
        question: "Which models are covered?",
        answer:
          "Concepts apply across OpenAI, Anthropic, Google, and open models. Weekly work uses APIs or chat tools your mentor recommends.",
      },
      {
        question: "Is this only for ChatGPT users?",
        answer:
          "No. You will learn transferable patterns for any major LLM provider and how to compare behavior across models.",
      },
      {
        question: "How much time per week?",
        answer: "Plan 5–7 hours including exercises, mentor feedback, and capstone prep.",
      },
    ],
  },
  {
    id: "gai-llms",
    slug: "generative-ai-llms",
    title: "Generative AI & LLMs",
    shortDescription: "Build with APIs, embeddings, RAG, and fine-tuning basics—mentor-reviewed capstone included.",
    longDescription:
      "Go beyond chatting with models. Learn how generative AI systems are built: API integration, embeddings, retrieval-augmented generation, safety guardrails, and light fine-tuning concepts. Weekly milestones culminate in a mentor-reviewed capstone app that retrieves, generates, and explains its answers.",
    level: "Intermediate",
    duration: "8 weeks",
    mode: "Online",
    priceLabel: "₹12,999 · Cohort-based",
    priceInPaise: 1299900,
    tags: ["RAG", "Embeddings", "APIs", "GenAI"],
    imageUrl: getCourseImage("generative-ai-llms"),
    featured: true,
    learnOutcomes: [
      "Integrate LLM APIs into a small application with error handling",
      "Chunk documents, embed text, and run retrieval-augmented queries",
      "Apply safety, moderation, and observability basics",
      "Deliver a capstone GenAI feature with documented evaluation results",
    ],
    curriculum: [
      { week: "Week 1", topics: ["GenAI landscape", "API setup", "Message patterns"] },
      { week: "Week 2", topics: ["Embeddings", "Similarity search", "Vector stores intro"] },
      { week: "Week 3", topics: ["RAG pipeline", "Chunking strategies", "Source attribution"] },
      { week: "Week 4", topics: ["Tool use overview", "Function calling", "Agent preview"] },
      { week: "Week 5", topics: ["Guardrails", "PII & policy", "Human-in-the-loop"] },
      { week: "Week 6", topics: ["Fine-tuning concepts", "When not to fine-tune", "Cost controls"] },
      { week: "Week 7", topics: ["Capstone build", "Mentor code review", "Iteration"] },
      { week: "Week 8", topics: ["Eval report", "Demo day", "Production checklist"] },
    ],
    faqs: [
      {
        question: "What programming background do I need?",
        answer:
          "Comfort with Python or JavaScript is recommended. Mentors provide starter repos so you can focus on GenAI concepts.",
      },
      {
        question: "Will I train models from scratch?",
        answer:
          "No. We focus on practical API, RAG, and light adaptation patterns used in industry today.",
      },
      {
        question: "Do I need a paid API key?",
        answer:
          "You will need access to an LLM API for projects. Mentors share cost-saving tips and small-budget exercise options.",
      },
      {
        question: "What does the capstone look like?",
        answer:
          "A small Q&A or assistant-style app over your own documents with retrieval, citations, and an evaluation summary.",
      },
    ],
  },
  {
    id: "aa-agents",
    slug: "ai-agents",
    title: "AI Agents (Agentic AI)",
    shortDescription: "Design multi-step agents with tools, memory, and orchestration—ship an agent capstone.",
    longDescription:
      "Learn agentic AI the way teams ship it: planners, tool routers, memory, human approvals, and observability. Practice with popular frameworks and patterns, then deliver a mentor-reviewed capstone agent that completes a real multi-step workflow—not a single prompt that hallucinates a plan.",
    level: "Intermediate",
    duration: "8 weeks",
    mode: "Online",
    priceLabel: "₹14,999 · Cohort-based",
    priceInPaise: 1499900,
    tags: ["Agents", "Tools", "Orchestration", "LangGraph"],
    imageUrl: getCourseImage("ai-agents"),
    featured: true,
    learnOutcomes: [
      "Model agent loops: plan → act → observe → reflect",
      "Connect tools (search, APIs, code) with permission boundaries",
      "Add memory, checkpoints, and human-in-the-loop approvals",
      "Ship a capstone agent with traces and failure handling",
    ],
    curriculum: [
      { week: "Week 1", topics: ["Agent vs chatbot", "ReAct pattern", "Tool contracts"] },
      { week: "Week 2", topics: ["Planner prompts", "Sub-tasks", "State machines"] },
      { week: "Week 3", topics: ["Tool routing", "API tools", "Error recovery"] },
      { week: "Week 4", topics: ["Memory layers", "Session vs long-term", "Summarization"] },
      { week: "Week 5", topics: ["Multi-agent patterns", "Handoffs", "Supervisor agents"] },
      { week: "Week 6", topics: ["Observability", "Traces", "Evaluating agents"] },
      { week: "Week 7", topics: ["Capstone scoping", "Build sprint", "Mentor review"] },
      { week: "Week 8", topics: ["Safety review", "Demo", "Deployment notes"] },
    ],
    faqs: [
      {
        question: "Should I complete Generative AI & LLMs first?",
        answer:
          "Prompt Engineering or equivalent LLM experience is enough. The GenAI track helps but is not strictly required.",
      },
      {
        question: "Which frameworks are used?",
        answer:
          "Concepts map to LangChain, LangGraph, and similar orchestration tools. Weekly materials reference current industry patterns.",
      },
      {
        question: "Are agents safe to run in production?",
        answer:
          "We teach guardrails, approval steps, and scoped tools. Your capstone includes a risk and mitigation write-up.",
      },
      {
        question: "How much time per week?",
        answer: "Expect 8–10 hours—agent projects are iteration-heavy and mentor feedback is async + live.",
      },
    ],
  },
  {
    id: "aia-automation",
    slug: "ai-automation",
    title: "AI Automation (n8n, Make, Zapier AI)",
    shortDescription: "Wire no-code/low-code AI workflows across n8n, Make, and Zapier—with measurable ops outcomes.",
    longDescription:
      "Connect the tools businesses already use. Build AI-powered automations with n8n, Make (Integromat), and Zapier AI: triggers, transforms, LLM steps, human approvals, and monitoring. Finish with a mentor-reviewed capstone workflow that saves real hours—not a diagram that never runs in production.",
    level: "Beginner Friendly",
    duration: "6 weeks",
    mode: "Online",
    priceLabel: "₹12,999 · Cohort-based",
    priceInPaise: 1299900,
    tags: ["n8n", "Make", "Zapier", "Automation"],
    imageUrl: getCourseImage("ai-automation"),
    featured: true,
    learnOutcomes: [
      "Map business processes into trigger → action automation flows",
      "Add LLM steps with guardrails in n8n, Make, and Zapier",
      "Handle errors, retries, and human approval branches",
      "Deliver a documented capstone automation with ROI estimates",
    ],
    curriculum: [
      { week: "Week 1", topics: ["Automation mindset", "Triggers & actions", "Data mapping"] },
      { week: "Week 2", topics: ["Zapier AI basics", "Zaps + AI steps", "Testing"] },
      { week: "Week 3", topics: ["Make scenarios", "Routers & filters", "LLM modules"] },
      { week: "Week 4", topics: ["n8n workflows", "Self-host option", "Credentials"] },
      { week: "Week 5", topics: ["Approvals", "Logging", "Failure alerts"] },
      { week: "Week 6", topics: ["Capstone workflow", "ROI doc", "Mentor sign-off"] },
    ],
    faqs: [
      {
        question: "Do I need coding experience?",
        answer:
          "No. This track is no-code/low-code first. Optional JSON and webhook concepts are explained when needed.",
      },
      {
        question: "Do I need paid accounts?",
        answer:
          "Free tiers of Zapier/Make/n8n are enough for coursework. Mentors note limits before you scale flows.",
      },
      {
        question: "Which platform should I specialize in?",
        answer:
          "You will touch all three so you can choose the best fit per client. Your capstone can focus on one primary tool.",
      },
      {
        question: "Who is this for?",
        answer:
          "Operators, founders, marketers, and builders who want practical AI automations without building a full app first.",
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
