import {
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  Gauge,
  Headphones,
  LayoutDashboard,
  MapPin,
  PhoneCall,
  ScanLine,
  ShieldCheck,
  Store,
  Target,
  Truck,
  UserCog,
  Users,
  Wallet,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { getCourseImage, marketingImages } from "@/lib/images";

export type ServiceFeature = { icon: LucideIcon; title: string; description: string };
export type ServiceStat = { value: string; label: string };
export type ServiceUseCase = { title: string; points: string[] };

export type BusinessService = {
  slug: string;
  /** Card metadata shown on the /business grid */
  card: { icon: LucideIcon; title: string; description: string };
  /** Detail-page hero */
  eyebrow: string;
  title: string;
  highlight: string;
  titleSuffix?: string;
  description: string;
  heroImage: string;
  stats: ServiceStat[];
  features: ServiceFeature[];
  capabilities: string[];
  useCases: ServiceUseCase[];
  audiences: string[];
  metaDescription: string;
};

export const businessServices: BusinessService[] = [
  {
    slug: "gig-staffing",
    card: {
      icon: Users,
      title: "Gig staffing",
      description: "On-ground and remote workers deployed for sales, field ops, and specialized roles.",
    },
    eyebrow: "Workforce · Staffing",
    title: "Deploy a trained",
    highlight: "gig workforce",
    titleSuffix: "on demand",
    description:
      "We source, verify, train, and manage on-ground and remote workers for sales, field operations, and specialized roles—so you can scale headcount up or down without the fixed cost.",
    heroImage: marketingImages.hero,
    stats: [
      { value: "1.5M+", label: "Workers in network" },
      { value: "1000+", label: "Cities covered" },
      { value: "48 hrs", label: "Typical time to deploy" },
    ],
    features: [
      { icon: Users, title: "Rapid sourcing", description: "Access a vetted, nationwide pool of gig workers ready to deploy." },
      { icon: ShieldCheck, title: "Verified & trained", description: "Background-checked workers onboarded with role-specific training." },
      { icon: LayoutDashboard, title: "Live tracking", description: "Attendance, tasks, and output visible in real time on a dashboard." },
      { icon: Wallet, title: "Managed payroll", description: "We handle payouts, compliance, and worker support end to end." },
      { icon: Boxes, title: "Elastic scale", description: "Ramp teams up for peaks and down after, with no idle overhead." },
      { icon: Gauge, title: "Outcome focus", description: "Pay for productive output, not just seats filled." },
    ],
    capabilities: ["Field sales", "Feet-on-street", "In-store staff", "Remote agents", "Seasonal ramp", "Specialized roles"],
    useCases: [
      { title: "Retail & FMCG", points: ["Store promoters", "Stock audits", "Secondary sales"] },
      { title: "E-commerce & logistics", points: ["Hub staffing", "Sortation", "Peak-season surge"] },
      { title: "BFSI", points: ["Lead generation", "Document collection", "Field verification"] },
      { title: "Events & activations", points: ["Brand ambassadors", "Setup crews", "On-site support"] },
    ],
    audiences: ["Retail", "FMCG", "E-commerce", "Logistics", "BFSI", "Telecom", "Startups", "Enterprises"],
    metaDescription:
      "Deploy a trained, verified gig workforce on demand for sales, field ops, and specialized roles across India—managed payroll, live tracking, and elastic scale.",
  },
  {
    slug: "promoter-merchandising",
    card: {
      icon: Store,
      title: "Promoter deployment & merchandising",
      description: "In-store and out-store promotion, BTL activations, up-sell and cross-sell across sectors.",
    },
    eyebrow: "Retail · Activation",
    title: "Drive sell-out with",
    highlight: "promoters & merchandising",
    description:
      "Deploy trained promoters and merchandisers across stores and markets to lift conversions, execute BTL activations, and keep shelves and displays exactly the way your brand intends.",
    heroImage: getCourseImage("ai-automation"),
    stats: [
      { value: "50k+", label: "Retail touchpoints" },
      { value: "95%+", label: "Planogram compliance" },
      { value: "Daily", label: "Sell-out reporting" },
    ],
    features: [
      { icon: Store, title: "In-store promotion", description: "Trained promoters to drive conversions and product trials." },
      { icon: Target, title: "BTL activations", description: "Roadshows, sampling, and market activations executed at scale." },
      { icon: ClipboardCheck, title: "Planogram compliance", description: "Shelf, display, and visibility audits with photo proof." },
      { icon: LayoutDashboard, title: "Live dashboards", description: "Sell-out, footfall, and stock data reported in real time." },
      { icon: Gauge, title: "Up-sell & cross-sell", description: "Scripts and incentives tuned to lift basket value." },
      { icon: MapPin, title: "Wide coverage", description: "Modern trade, general trade, and rural markets alike." },
    ],
    capabilities: ["In-store promoters", "Merchandisers", "BTL activations", "Sampling", "Visibility audits", "Sell-out tracking"],
    useCases: [
      { title: "Consumer electronics", points: ["Demo promoters", "Display setup", "Festive campaigns"] },
      { title: "FMCG & beverages", points: ["Sampling drives", "Shelf compliance", "New launch push"] },
      { title: "Fashion & lifestyle", points: ["Store staffing", "VM execution", "Season activations"] },
      { title: "Telecom & devices", points: ["Retail promoters", "Plan up-sell", "Trade marketing"] },
    ],
    audiences: ["FMCG", "Consumer electronics", "Retail", "Telecom", "Fashion", "Beverages", "Automotive", "Healthcare"],
    metaDescription:
      "Trained promoters and merchandisers for in-store and out-store promotion, BTL activations, and planogram compliance—driving sell-out with daily reporting.",
  },
  {
    slug: "telecalling",
    card: {
      icon: PhoneCall,
      title: "Telecalling",
      description: "Inbound and outbound calling at scale for lead generation, feedback, and support.",
    },
    eyebrow: "Contact centre · Voice",
    title: "Scale conversations with",
    highlight: "managed telecalling",
    description:
      "Spin up inbound and outbound calling teams for lead generation, onboarding, feedback, and support—trained agents, quality monitoring, and CRM integration, billed on outcomes.",
    heroImage: getCourseImage("generative-ai-llms"),
    stats: [
      { value: "2L+", label: "Calls handled daily" },
      { value: "20+", label: "Languages & dialects" },
      { value: "24/7", label: "Coverage available" },
    ],
    features: [
      { icon: PhoneCall, title: "Inbound & outbound", description: "Full-funnel voice ops from lead gen to retention." },
      { icon: Users, title: "Trained agents", description: "Product-trained callers matched to your audience and language." },
      { icon: Headphones, title: "Quality monitoring", description: "Call scoring, barge-in, and coaching to protect CX." },
      { icon: LayoutDashboard, title: "CRM integration", description: "Dispositions and data synced to your systems in real time." },
      { icon: Gauge, title: "Outcome billing", description: "Pay per qualified lead, resolution, or connect." },
      { icon: Boxes, title: "Elastic capacity", description: "Ramp seats for campaigns and peaks without lock-in." },
    ],
    capabilities: ["Lead generation", "Tele-sales", "Onboarding", "Feedback & surveys", "Collections", "Customer support"],
    useCases: [
      { title: "BFSI", points: ["Loan lead gen", "EMI reminders", "Policy renewals"] },
      { title: "E-commerce", points: ["Order confirmation", "Win-back", "CSAT surveys"] },
      { title: "EdTech & SaaS", points: ["Demo booking", "Onboarding", "Retention calls"] },
      { title: "Healthcare", points: ["Appointment reminders", "Follow-ups", "Feedback"] },
    ],
    audiences: ["BFSI", "E-commerce", "EdTech", "SaaS", "Healthcare", "Telecom", "Real estate", "Insurance"],
    metaDescription:
      "Managed inbound and outbound telecalling at scale for lead generation, onboarding, feedback, and support—multilingual agents, QA, and CRM integration.",
  },
  {
    slug: "auditing-diligence",
    card: {
      icon: ClipboardCheck,
      title: "Auditing & diligence",
      description: "Large-scale audits across retail, warehouses, hospitality, and BFSI.",
    },
    eyebrow: "Assurance · Audits",
    title: "Ground-truth with",
    highlight: "audits & diligence",
    description:
      "Run large-scale physical and process audits across your network—retail, warehouses, hospitality, and BFSI—with geo-tagged, photo-verified reports you can act on.",
    heroImage: getCourseImage("ai-agents"),
    stats: [
      { value: "450+", label: "Cities reachable" },
      { value: "Geo-tagged", label: "Verified evidence" },
      { value: "99%+", label: "Report accuracy" },
    ],
    features: [
      { icon: ClipboardCheck, title: "Standardized checklists", description: "Configurable audit forms tailored to your SOPs." },
      { icon: MapPin, title: "Geo-tagged proof", description: "Location- and time-stamped photos for every visit." },
      { icon: ShieldCheck, title: "Fraud detection", description: "Multi-layer checks to flag anomalies and mismatches." },
      { icon: LayoutDashboard, title: "Live reporting", description: "Findings and dashboards updated as audits complete." },
      { icon: Gauge, title: "Fast turnaround", description: "Nationwide coverage delivered on tight timelines." },
      { icon: Boxes, title: "Scale on demand", description: "Hundreds of simultaneous audits when you need them." },
    ],
    capabilities: ["Retail audits", "Warehouse audits", "Process audits", "Mystery shopping", "Stock reconciliation", "Compliance checks"],
    useCases: [
      { title: "Retail & QSR", points: ["Store standards", "Mystery shopping", "Brand compliance"] },
      { title: "Warehousing", points: ["Stock counts", "Process adherence", "Safety audits"] },
      { title: "BFSI", points: ["Branch audits", "KYC checks", "Risk diligence"] },
      { title: "Hospitality", points: ["Service audits", "Hygiene checks", "Guest experience"] },
    ],
    audiences: ["Retail", "QSR", "Warehousing", "BFSI", "Hospitality", "Manufacturing", "Automotive", "Government"],
    metaDescription:
      "Large-scale, geo-tagged physical and process audits across retail, warehouses, hospitality, and BFSI with photo-verified reports and live dashboards.",
  },
  {
    slug: "exam-invigilation",
    card: {
      icon: ScanLine,
      title: "Exam invigilation & proctoring",
      description: "Managed on-ground and remote invigilation for high-stakes assessments.",
    },
    eyebrow: "Assessments · Proctoring",
    title: "Secure exams with",
    highlight: "invigilation & proctoring",
    description:
      "Deliver fair, high-stakes assessments at scale with managed on-ground invigilators and AI-assisted remote proctoring—identity verification, live monitoring, and incident reporting.",
    heroImage: getCourseImage("prompt-engineering"),
    stats: [
      { value: "Pan-India", label: "Centre coverage" },
      { value: "AI + human", label: "Proctoring" },
      { value: "Secure", label: "Chain of custody" },
    ],
    features: [
      { icon: ScanLine, title: "Remote proctoring", description: "AI-assisted monitoring with human review of flags." },
      { icon: Users, title: "On-ground invigilators", description: "Trained staff for centre-based assessments nationwide." },
      { icon: BadgeCheck, title: "Identity verification", description: "Candidate authentication to prevent impersonation." },
      { icon: ShieldCheck, title: "Integrity controls", description: "Malpractice detection and secure incident logging." },
      { icon: LayoutDashboard, title: "Live command centre", description: "Real-time visibility across centres and sessions." },
      { icon: Gauge, title: "Scale for peaks", description: "Thousands of concurrent candidates on exam day." },
    ],
    capabilities: ["On-ground invigilation", "Remote proctoring", "ID verification", "Live monitoring", "Incident reporting", "Centre management"],
    useCases: [
      { title: "Education boards", points: ["Entrance exams", "Semester tests", "Certifications"] },
      { title: "Recruitment", points: ["Aptitude tests", "Skill assessments", "Campus drives"] },
      { title: "Government", points: ["Competitive exams", "Eligibility tests", "Licensing"] },
      { title: "Corporates", points: ["Compliance tests", "Upskilling exams", "Internal certs"] },
    ],
    audiences: ["Education", "Recruitment", "Government", "Certification bodies", "Corporates", "EdTech", "Universities", "Skilling"],
    metaDescription:
      "Managed on-ground invigilation and AI-assisted remote proctoring for high-stakes exams—identity verification, live monitoring, and integrity controls at scale.",
  },
  {
    slug: "last-mile-delivery",
    card: {
      icon: Truck,
      title: "Last-mile delivery",
      description: "Complex logistics fulfilment, including high-traffic and multi-point routes.",
    },
    eyebrow: "Logistics · Fulfilment",
    title: "Fulfil faster with",
    highlight: "last-mile delivery",
    description:
      "Deploy a flexible delivery workforce for complex, high-density, and multi-point routes—managed riders, live tracking, and proof of delivery, scaled to your demand curve.",
    heroImage: getCourseImage("ai-automation"),
    stats: [
      { value: "19,000+", label: "Pin codes reached" },
      { value: "On-demand", label: "Rider scale" },
      { value: "Live", label: "Track & trace" },
    ],
    features: [
      { icon: Truck, title: "Flexible fleet", description: "Riders and delivery associates matched to your volume." },
      { icon: MapPin, title: "Route coverage", description: "High-traffic, rural, and multi-point routes handled." },
      { icon: LayoutDashboard, title: "Live tracking", description: "Real-time visibility from pickup to proof of delivery." },
      { icon: ShieldCheck, title: "Verified riders", description: "Background-checked, trained, and app-enabled workforce." },
      { icon: Boxes, title: "Peak-ready scale", description: "Surge capacity for sales and festive spikes." },
      { icon: Wallet, title: "Managed payouts", description: "Rider payments and compliance handled by us." },
    ],
    capabilities: ["Same-day delivery", "Hyperlocal", "Multi-point routes", "Reverse logistics", "COD handling", "Hub operations"],
    useCases: [
      { title: "E-commerce", points: ["Hyperlocal delivery", "Peak surge", "Returns pickup"] },
      { title: "Q-commerce & food", points: ["Rapid delivery", "Dense routes", "Rider scale"] },
      { title: "Pharma & grocery", points: ["Scheduled drops", "Cold-chain support", "COD"] },
      { title: "D2C brands", points: ["Launch fulfilment", "City expansion", "SLA delivery"] },
    ],
    audiences: ["E-commerce", "Q-commerce", "Food delivery", "Pharma", "Grocery", "D2C", "Logistics", "Retail"],
    metaDescription:
      "Flexible last-mile delivery workforce for complex, high-density, and multi-point routes—verified riders, live tracking, and proof of delivery at scale.",
  },
  {
    slug: "verification-services",
    card: {
      icon: BadgeCheck,
      title: "Verification services",
      description: "Identity, address, and document verification with geo-tagging across cities.",
    },
    eyebrow: "Trust · Verification",
    title: "Verify anyone with",
    highlight: "field verification",
    description:
      "Run identity, address, employment, and document verification across the country with geo-tagged field visits and digital checks—fast turnaround and audit-ready reports.",
    heroImage: getCourseImage("ai-agents"),
    stats: [
      { value: "450+", label: "Cities for field visits" },
      { value: "Geo-tagged", label: "Verified visits" },
      { value: "Fast", label: "TAT on reports" },
    ],
    features: [
      { icon: BadgeCheck, title: "Identity checks", description: "Aadhaar, PAN, and document authentication." },
      { icon: MapPin, title: "Address verification", description: "Geo-tagged, photo-proofed physical visits." },
      { icon: ClipboardCheck, title: "Employment & education", description: "Background checks on records and references." },
      { icon: ShieldCheck, title: "Fraud screening", description: "Anomaly detection and negative-database checks." },
      { icon: LayoutDashboard, title: "Case dashboards", description: "Track every case from request to report." },
      { icon: Gauge, title: "Nationwide TAT", description: "Consistent turnaround across cities and towns." },
    ],
    capabilities: ["Identity verification", "Address verification", "Employment checks", "Education checks", "Document checks", "Court/record checks"],
    useCases: [
      { title: "BFSI & lending", points: ["Borrower KYC", "Address checks", "Income proof"] },
      { title: "Gig platforms", points: ["Partner onboarding", "ID & address", "Ongoing screening"] },
      { title: "HR & staffing", points: ["Pre-employment", "Education checks", "Reference checks"] },
      { title: "Insurance", points: ["Claim verification", "Policyholder checks", "Risk diligence"] },
    ],
    audiences: ["BFSI", "Lending", "Gig platforms", "HR & staffing", "Insurance", "E-commerce", "Real estate", "Telecom"],
    metaDescription:
      "Identity, address, employment, and document verification across India with geo-tagged field visits, fraud screening, and audit-ready reports.",
  },
  {
    slug: "expert-contracting",
    card: {
      icon: UserCog,
      title: "Expert contracting",
      description: "High-skilled white-collar talent sourced and managed on a contractual basis.",
    },
    eyebrow: "Talent · Contracting",
    title: "Hire skilled talent via",
    highlight: "expert contracting",
    description:
      "Access high-skilled white-collar professionals—engineering, design, analytics, operations, and more—sourced, onboarded, and managed on a flexible contractual basis.",
    heroImage: getCourseImage("prompt-engineering"),
    stats: [
      { value: "Vetted", label: "Specialist talent" },
      { value: "Flexible", label: "Contract terms" },
      { value: "Managed", label: "Payroll & compliance" },
    ],
    features: [
      { icon: UserCog, title: "Specialist sourcing", description: "Curated white-collar talent matched to your brief." },
      { icon: ShieldCheck, title: "Vetted & verified", description: "Skill-assessed and background-checked professionals." },
      { icon: Workflow, title: "Fast onboarding", description: "Contract, compliance, and setup handled quickly." },
      { icon: Wallet, title: "Managed payroll", description: "We run payouts, taxes, and statutory compliance." },
      { icon: Boxes, title: "Scale teams", description: "Add or wind down specialists as projects evolve." },
      { icon: LayoutDashboard, title: "Performance visibility", description: "Track deliverables and utilization centrally." },
    ],
    capabilities: ["Engineering", "Data & analytics", "Design", "Operations", "Finance", "Project management"],
    useCases: [
      { title: "Tech & product", points: ["Dev augmentation", "QA & data", "Project pods"] },
      { title: "Analytics & AI", points: ["Data engineers", "Analysts", "ML support"] },
      { title: "Operations", points: ["Ops managers", "Program leads", "Coordinators"] },
      { title: "Corporate functions", points: ["Finance", "HR ops", "Marketing"] },
    ],
    audiences: ["Startups", "Enterprises", "SaaS", "BFSI", "Consulting", "AI & ML", "E-commerce", "Manufacturing"],
    metaDescription:
      "High-skilled white-collar talent—engineering, analytics, design, and operations—sourced and managed on a flexible contractual basis with managed payroll.",
  },
];

export function getBusinessService(slug: string) {
  return businessServices.find((s) => s.slug === slug);
}
