export type CourseResource = {
  title: string;
  url: string;
  type: "video" | "doc" | "link";
};

type WeekResourceMap = Record<number, CourseResource[]>;

const BASE_CONTACT = (courseSlug: string): CourseResource[] => [
  { title: "Book a mentor check-in", url: `/contact?course=${encodeURIComponent(courseSlug)}`, type: "link" },
];

function syllabusResource(courseSlug: string, weekLabel: string): CourseResource {
  return {
    title: `${weekLabel} — syllabus & milestones`,
    url: `/courses/${courseSlug}/syllabus`,
    type: "doc",
  };
}

const COURSE_WEEK_RESOURCES: Record<string, WeekResourceMap> = {
  "prompt-engineering": {
    0: [
      { title: "OpenAI — Prompt engineering guide", url: "https://platform.openai.com/docs/guides/prompt-engineering", type: "doc" },
      { title: "Anthropic — Prompt design", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "doc" },
    ],
    1: [
      { title: "Few-shot learning patterns", url: "https://www.promptingguide.ai/techniques/fewshot", type: "doc" },
      { title: "Chain-of-thought (when to use)", url: "https://www.promptingguide.ai/techniques/cot", type: "doc" },
    ],
    2: [
      { title: "OpenAI — Structured outputs", url: "https://platform.openai.com/docs/guides/structured-outputs", type: "doc" },
      { title: "JSON schema for LLMs", url: "https://json-schema.org/learn", type: "doc" },
    ],
    3: [
      { title: "RAG overview (Google)", url: "https://cloud.google.com/use-cases/retrieval-augmented-generation", type: "doc" },
      { title: "Grounding with citations", url: "https://www.anthropic.com/news/claude-can-now-search-the-web", type: "doc" },
    ],
    4: [
      { title: "LLM evaluation basics", url: "https://docs.smith.langchain.com/evaluation", type: "doc" },
      { title: "Prompt regression testing", url: "https://www.promptingguide.ai/", type: "doc" },
    ],
    5: [
      { title: "Prompt library examples", url: "https://github.com/f/awesome-chatgpt-prompts", type: "doc" },
      { title: "Portfolio packaging tips", url: "https://www.freecodecamp.org/news/how-to-build-a-great-portfolio/", type: "doc" },
    ],
  },
  "generative-ai-llms": {
    0: [
      { title: "OpenAI API quickstart", url: "https://platform.openai.com/docs/quickstart", type: "doc" },
      { title: "Hugging Face — LLM course", url: "https://huggingface.co/learn/nlp-course", type: "doc" },
    ],
    1: [
      { title: "Embeddings guide", url: "https://platform.openai.com/docs/guides/embeddings", type: "doc" },
      { title: "Vector database primer", url: "https://www.pinecone.io/learn/vector-database/", type: "doc" },
    ],
    2: [
      { title: "LangChain — RAG tutorial", url: "https://python.langchain.com/docs/tutorials/rag/", type: "doc" },
      { title: "Chunking strategies", url: "https://www.llamaindex.ai/blog/evaluating-chunking-strategies", type: "doc" },
    ],
    3: [
      { title: "Function calling", url: "https://platform.openai.com/docs/guides/function-calling", type: "doc" },
      { title: "Tool use patterns", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", type: "doc" },
    ],
    4: [
      { title: "OpenAI moderation", url: "https://platform.openai.com/docs/guides/moderation", type: "doc" },
      { title: "Responsible AI practices", url: "https://ai.google/responsibility/responsible-ai-practices/", type: "doc" },
    ],
    5: [
      { title: "Fine-tuning overview", url: "https://platform.openai.com/docs/guides/fine-tuning", type: "doc" },
      { title: "When RAG beats fine-tuning", url: "https://www.anthropic.com/news/contextual-retrieval", type: "doc" },
    ],
    6: [
      { title: "Observability with LangSmith", url: "https://docs.smith.langchain.com/", type: "doc" },
      { title: "Capstone README template", url: "https://www.makeareadme.com/", type: "doc" },
    ],
    7: [
      { title: "GenAI production checklist", url: "https://github.com/openai/openai-cookbook", type: "doc" },
      { title: "Demo presentation guide", url: "https://hbr.org/2013/06/how-to-give-a-killer-presentation", type: "doc" },
    ],
  },
  "ai-agents": {
    0: [
      { title: "LangGraph intro", url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/", type: "doc" },
      { title: "ReAct paper summary", url: "https://react-lm.github.io/", type: "doc" },
    ],
    1: [
      { title: "Planning agents", url: "https://www.anthropic.com/engineering/building-effective-agents", type: "doc" },
      { title: "State machines for agents", url: "https://langchain-ai.github.io/langgraph/concepts/low_level/", type: "doc" },
    ],
    2: [
      { title: "Tool design for LLMs", url: "https://platform.openai.com/docs/guides/tools", type: "doc" },
      { title: "Error handling patterns", url: "https://docs.smith.langchain.com/", type: "doc" },
    ],
    3: [
      { title: "Agent memory patterns", url: "https://langchain-ai.github.io/langgraph/concepts/memory/", type: "doc" },
      { title: "Summarization for long context", url: "https://www.anthropic.com/news/contextual-retrieval", type: "doc" },
    ],
    4: [
      { title: "Multi-agent workflows", url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/", type: "doc" },
      { title: "Supervisor pattern", url: "https://www.anthropic.com/engineering/building-effective-agents", type: "doc" },
    ],
    5: [
      { title: "Tracing agent runs", url: "https://docs.smith.langchain.com/observability", type: "doc" },
      { title: "Evaluating agents", url: "https://docs.smith.langchain.com/evaluation", type: "doc" },
    ],
    6: [
      { title: "Agent safety checklist", url: "https://ai.google/responsibility/responsible-ai-practices/", type: "doc" },
      { title: "Architecture decision records", url: "https://adr.github.io/", type: "doc" },
    ],
    7: [
      { title: "Agent deployment notes", url: "https://langchain-ai.github.io/langgraph/cloud/", type: "doc" },
      { title: "Capstone demo checklist", url: "https://www.ycombinator.com/library", type: "link" },
    ],
  },
  "ai-automation": {
    0: [
      { title: "Zapier — What is automation?", url: "https://zapier.com/blog/what-is-zapier/", type: "doc" },
      { title: "n8n documentation", url: "https://docs.n8n.io/", type: "doc" },
    ],
    1: [
      { title: "Zapier AI actions", url: "https://zapier.com/ai", type: "doc" },
      { title: "Testing Zaps", url: "https://help.zapier.com/hc/en-us/articles/8494518956301", type: "doc" },
    ],
    2: [
      { title: "Make Academy", url: "https://www.make.com/en/academy", type: "link" },
      { title: "Make AI modules", url: "https://www.make.com/en/integrations/openai", type: "doc" },
    ],
    3: [
      { title: "n8n AI nodes", url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain/", type: "doc" },
      { title: "Self-hosting n8n", url: "https://docs.n8n.io/hosting/", type: "doc" },
    ],
    4: [
      { title: "Human-in-the-loop automations", url: "https://zapier.com/blog/human-in-the-loop/", type: "doc" },
      { title: "Error workflows in Make", url: "https://www.make.com/en/help/scenarios/error-handling", type: "doc" },
    ],
    5: [
      { title: "Automation ROI worksheet", url: "https://www.notion.so/help/guides/what-is-notion", type: "link" },
      { title: "Ops case study examples", url: "https://zapier.com/blog/automation-examples/", type: "doc" },
    ],
  },
};

export function getWeekResources(courseSlug: string, weekIndex: number, weekLabel: string): CourseResource[] {
  const syllabus = syllabusResource(courseSlug, weekLabel);
  const contact = BASE_CONTACT(courseSlug);
  const weekExtras = COURSE_WEEK_RESOURCES[courseSlug]?.[weekIndex] ?? [];

  return [syllabus, ...weekExtras, ...contact];
}
