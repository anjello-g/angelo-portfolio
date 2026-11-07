// ─────────────────────────────────────────────────────────────
// All editable site content lives here, sourced from Angelo's 2026 resume.
//
// CONFIRM = a wording or number I derived from the resume; double-check it.
// TODO    = a fact only you can supply.
//
// Run `npm run check:launch` to list anything still unresolved.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Angelo Gaspe",
  role: "BI Developer",
  tagline: "Software Developer",
  employer: "Knack RCM",
  intro:
    "I'm Angelo Gaspe, a Business Intelligence Developer who builds Power BI and DOMO dashboards, automates reporting with Python, and turns workforce data into decisions leaders can act on.",
  about:
    "Results-driven Business Intelligence Developer with a strong foundation in software development and workforce analytics. I build operational, executive, and client-facing dashboards that empower leadership decisions, and I'm known for knowledge-sharing, process improvement, and adaptability in fast-paced healthcare environments.",
  email: "angelogaspe@gmail.com",
  linkedin: "https://www.linkedin.com/in/anjello-g",
  linkedinLabel: "linkedin.com/in/anjello-g",
  github: "https://github.com/anjellog",
  githubLabel: "github.com/anjellog",
  location: "Lipa City, Batangas, Philippines",
  // Your phone number is in the downloadable resume but deliberately NOT shown on
  // the public site (it invites spam). Add it here only if you want it visible.
  resumeUrl: "/Angelo_Gaspe_Resume.pdf",
};

// Rotating hero headline. Each one is two lines: `line1`, then `lead` + the italic `accent`.
// Written from the resume (Power BI / DOMO dashboards, hourly executive updates, Python
// automation, workforce analytics, software-development background). Edit freely; keep each
// line under ~20 characters so it fits on one line on a phone. The first one is shown first.
export interface Tagline {
  line1: string;
  lead: string;
  accent: string;
}

export const taglines: Tagline[] = [
  { line1: "Turning Data", lead: "into Better ", accent: "Decisions." },
  { line1: "Dashboards Leaders", lead: "Use Every ", accent: "Day." },
  { line1: "Workforce Data,", lead: "Ready by the ", accent: "Hour." },
  { line1: "Automating the", lead: "Work Behind ", accent: "Reports." },
  { line1: "Clear Numbers for", lead: "Fast-Moving ", accent: "Teams." },
  { line1: "Developer Skills,", lead: "Analyst ", accent: "Mindset." },
];

// CONFIRM: numbers derived from the resume.
//  - 2+ years: first role Dec 2023 (about 2 years 11 months by Nov 2026)
//  - 3 countries: freelance clients in the UAE, Germany and the United States
//  - 5 certifications: the five listed under Certifications
export const stats = [
  { value: 2, suffix: "+", label: "Years of professional experience" },
  { value: 3, suffix: "", label: "Countries of freelance clients" },
  { value: 5, suffix: "", label: "Certifications & certificates" },
];

/* ───────────── Skills ───────────── */

export type SkillId =
  | "powerbi"
  | "domo"
  | "excel"
  | "sql"
  | "python"
  | "javascript"
  | "git"
  | "api";

export const skills: { id: SkillId; label: string }[] = [
  { id: "powerbi", label: "Power BI" },
  { id: "domo", label: "DOMO" },
  { id: "excel", label: "Excel" },
  { id: "sql", label: "SQL" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "git", label: "Git" },
  { id: "api", label: "API Integration" },
];

export const skillGroups: { id: string; short: string; items: string[] }[] = [
  {
    id: "bi",
    short: "BI & Analytics",
    items: [
      "Power BI",
      "DOMO",
      "Dashboard Development",
      "DAX",
      "Data Modeling",
      "Microsoft Excel",
      "Advanced Functions",
      "Pivot Tables",
      "Power Query",
      "Data Visualization",
      "Workforce Analytics",
      "Performance Reporting",
    ],
  },
  {
    id: "dev",
    short: "Programming",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP",
      "Python",
      "Java",
      "C#",
      "SQL",
      "Visual Basic",
      "Kotlin",
      "Liquid (Shopify)",
    ],
  },
  {
    id: "tools",
    short: "Tools & Platforms",
    items: [
      "Git",
      "Visual Studio",
      "Visual Studio Code",
      "Android Studio",
      "Microsoft Office Suite",
      "Shopify Development",
      "Power BI",
    ],
  },
  {
    id: "core",
    short: "Core Competencies",
    items: [
      "Database Management",
      "API Integration",
      "Automation",
      "Process Optimization",
      "Client Relationship Management",
      "Cross-functional Collaboration",
      "Training & Mentorship",
      "Queue Management",
      "Adherence Monitoring",
    ],
  },
];

/* ───────────── Experience ───────────── */

export interface Role {
  id: string;
  title: string;
  org: string;
  location: string;
  period: string;
  current?: boolean;
  bullets: string[];
  tools: string[];
}

export const roles: Role[] = [
  {
    id: "bi",
    title: "Business Intelligence Developer",
    org: "Knack RCM",
    location: "Lipa City, Batangas",
    period: "May 2026 – Present",
    current: true,
    bullets: [
      "Develop and maintain operational, executive, and client-facing dashboards in Power BI and DOMO, turning multi-source data into insights for leadership and stakeholders.",
      "Own end-to-end staffing across all sites, consolidating data from multiple resources into accurate daily staffing reports for workforce planning.",
      "Manage attendance reporting from multiple data sources across sites, delivering hourly updates to executives to support real-time staffing and operational decisions.",
      "Build Python scripts and automation tools that streamline data collection and reporting workflows, increasing the team's turnaround speed.",
    ],
    tools: ["Power BI", "DOMO", "Python"],
  },
  {
    id: "analyst",
    title: "Workforce Analyst",
    org: "Knack RCM",
    location: "Lipa City, Batangas",
    period: "June 2025 – May 2026",
    bullets: [
      "Designed and developed Power BI and DOMO dashboards used daily by managers and leaders for strategic workforce planning and operational oversight across multiple programs.",
      "Created the Headcount Dashboard, integrating headcount metrics, billable-hours tracking, attendance analytics, hiring forecasts, and other reports.",
      "Built and maintain Productivity Dashboards for multiple programs, consolidating KPIs and performance metrics for daily operational reports and weekly business reviews with clients.",
    ],
    tools: ["Power BI", "DOMO"],
  },
  {
    id: "healthcare",
    title: "Healthcare Associate",
    org: "HealthyBos Global",
    location: "Lipa City, Batangas",
    period: "Aug 2024 – June 2025",
    bullets: [
      "Navigated systems quickly and multitasked while maintaining a high level of service.",
      "Used Microsoft Excel, Word, and internal systems to track and document cases.",
      "Collaborated with teammates and leaders to improve processes, taking on new responsibilities in reporting, leadership, and client satisfaction.",
    ],
    tools: ["Microsoft Excel", "Microsoft Word", "Internal systems"],
  },
  {
    id: "webdev",
    title: "Web Developer (Internship)",
    org: "ShapeTech I.T. Services",
    location: "Lipa City, Batangas",
    period: "Dec 2023 – Apr 2024",
    bullets: [
      "Developed features for the company's official website, improving user experience and functionality.",
      "Worked with a team of developers to implement responsive design principles.",
      "Attended industry conferences to keep up with web development trends.",
    ],
    tools: ["HTML", "PHP", "CSS (Tailwind)", "JavaScript"],
  },
  {
    id: "softdev",
    title: "Software Developer (Internship)",
    org: "Integr8 Software Solutions",
    location: "General Trias, Cavite",
    period: "Feb 2024 – Mar 2024",
    bullets: [
      "Led development of the BookThrift platform.",
      "Optimized system performance and usability for efficient user interactions.",
      "Applied agile methods and presented project updates in team meetings, keeping the team aligned.",
    ],
    tools: ["ASP.NET", "HTML", "CSS (Bootstrap)", "JavaScript", "SQL"],
  },
  {
    id: "freelance",
    title: "Freelance Web Developer",
    org: "Self-employed",
    location: "Remote",
    period: "2022",
    bullets: [
      "Designed and built custom websites for clients in the UAE, Germany, and the United States across e-commerce, business, and personal branding.",
      "Delivered responsive, high-performance sites with HTML, CSS (Tailwind/Bootstrap), JavaScript, PHP, and Shopify (Liquid).",
      "Managed client communication and timelines independently, prioritizing UI/UX and cross-device compatibility, which earned repeat business and referrals.",
    ],
    tools: ["HTML", "CSS", "JavaScript", "PHP", "Shopify (Liquid)"],
  },
];

/* ───────────── Education & certifications ───────────── */

export const education = {
  degree: "Bachelor of Science in Computer Science",
  school: "Kolehiyo ng Lungsod ng Lipa",
  location: "Lipa City, Batangas",
  year: "2024",
  honors: [
    "Academic Distinction Awardee",
    "Best Thesis Award, Mobile Application Category",
    "Best Programmer",
  ],
};

export const certifications = [
  { title: "DOMO Student Certification Course", issuer: "DOMO", year: "2026" },
  { title: "Data Analytics Essentials", issuer: "Cisco Networking Academy", year: "2026" },
  { title: "Certificate of Attendance", issuer: "DICT Region IV-A", year: "2024" },
  { title: "Certificate of Completion", issuer: "ShapeTech I.T. Services", year: "2024" },
  { title: "Certificate of Appreciation", issuer: "Integr8 Software Solutions", year: "2024" },
];

/* ───────────── Projects ───────────── */

export type PreviewKind = "dashboard" | "kpi" | "hourly" | "workflow" | "voice" | "shop";

export interface CaseStudy {
  /**
   * Set false to hide this case study (and make its card non-clickable) in
   * production builds. In `npm run dev` it is always viewable.
   */
  ready: boolean;
  role: string;
  timeframe: string;
  /** Why the work mattered. */
  problem: string;
  /** What was built, in the resume's own terms. */
  approach: string;
  /** A simplified, NON-confidential flow, left to right. */
  architecture: string[];
  /** Impact stated on the resume. Add verified numbers when you have them. */
  outcome: string;
  /** Optional safe screenshot in /public (e.g. "/projects/headcount.png"). */
  image?: string;
  imageAlt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  preview: PreviewKind;
  /** Tools shown on the case-study page. */
  tools: string[];
  /** Which skill tiles filter to this project. */
  tags: SkillId[];
  caseStudy: CaseStudy;
}

// CONFIRM: the "problem" and "flow" lines are my wording around the facts on
// your resume. Edit them so they read the way you would explain the work.
export const projects: Project[] = [
  {
    id: "headcount",
    title: "Headcount Dashboard",
    description:
      "One Power BI and DOMO view of headcount, billable hours, attendance and hiring forecasts.",
    preview: "dashboard",
    tools: ["Power BI", "DOMO"],
    tags: ["powerbi", "domo"],
    caseStudy: {
      ready: true,
      role: "Workforce Analyst",
      timeframe: "June 2025 – May 2026 · Knack RCM",
      problem:
        "Headcount, billable hours, attendance and hiring forecasts came from separate data streams, but managers and leaders needed them together for workforce planning.",
      approach:
        "Designed and developed the Headcount Dashboard in Power BI and DOMO, integrating headcount metrics, billable-hours tracking, attendance analytics, hiring forecasts and other reports into one view.",
      architecture: ["Multiple data streams", "Data model", "Headcount Dashboard", "Workforce planning"],
      outcome:
        "Used daily by managers and leaders for strategic workforce planning and operational oversight across multiple programs.",
    },
  },
  {
    id: "productivity",
    title: "Productivity Dashboards",
    description:
      "KPIs and performance metrics for every program, ready for daily reports and weekly client reviews.",
    preview: "kpi",
    tools: ["Power BI", "DOMO"],
    tags: ["powerbi", "domo"],
    caseStudy: {
      ready: true,
      role: "Workforce Analyst",
      timeframe: "June 2025 – May 2026 · Knack RCM",
      problem:
        "Each program needed its KPIs and performance metrics in one place for daily operational reporting and weekly business reviews with clients.",
      approach:
        "Built, and continue to maintain, Productivity Dashboards for multiple programs that consolidate KPIs and performance metrics into a consistent, reviewable format.",
      architecture: ["Program KPIs", "Consolidation", "Productivity Dashboard", "Daily and weekly reviews"],
      outcome:
        "Supports daily operational reports and weekly business reviews with clients across multiple programs.",
    },
  },
  {
    id: "staffing",
    title: "Staffing & Attendance Reporting",
    description:
      "Daily staffing reports and hourly attendance updates for executives across every site.",
    preview: "hourly",
    tools: ["Power BI", "DOMO"],
    tags: ["powerbi", "domo"],
    caseStudy: {
      ready: true,
      role: "Business Intelligence Developer",
      timeframe: "May 2026 – Present · Knack RCM",
      problem:
        "Executives needed accurate, current staffing and attendance numbers across every site to make real-time operational decisions.",
      approach:
        "Own staffing end to end across all sites, consolidating data from multiple resources into accurate daily staffing reports, and manage attendance reporting from multiple sources with hourly updates to executives.",
      architecture: ["Multiple sources", "Consolidation", "Daily staffing report", "Hourly executive updates"],
      outcome:
        "Gives executives hourly visibility to support real-time staffing and operational decisions, and gives workforce planning accurate daily numbers.",
    },
  },
  {
    id: "automation",
    title: "Python Reporting Automation",
    description:
      "Python scripts and tools that streamline data collection and reporting workflows.",
    preview: "workflow",
    tools: ["Python"],
    tags: ["python"],
    caseStudy: {
      ready: true,
      role: "Business Intelligence Developer",
      timeframe: "May 2026 – Present · Knack RCM",
      problem:
        "Collecting data and assembling reports by hand was repetitive and slowed down the team's turnaround.",
      approach:
        "Build Python scripts and automation tools that streamline data collection and reporting workflows.",
      architecture: ["Data collection", "Python scripts", "Reporting workflow", "Faster turnaround"],
      outcome: "Increased the team's turnaround speed on data collection and reporting.",
    },
  },
  {
    id: "alice",
    title: "ALICE: AI English Learning App",
    description:
      "Research on an AI-driven app that helps Filipino college students improve their English.",
    preview: "voice",
    tools: ["Natural language processing", "Speech-to-text", "Text-to-speech", "AI"],
    tags: [],
    caseStudy: {
      ready: true,
      role: "Researcher",
      timeframe: "Dec 2023 · Kolehiyo ng Lungsod ng Lipa",
      problem:
        "How can an app support English proficiency among Filipino college students? ALICE (Assisted Language Improvement and Correction Experience) was the subject of the study.",
      approach:
        "Researched ALICE's impact, developed hypotheses, and implemented interactive features, English lessons and language games using natural language processing, speech-to-text, text-to-speech and artificial intelligence.",
      architecture: ["Research question", "Lessons and games", "NLP and speech", "User feedback"],
      outcome:
        "Received excellent feedback on functionality, compatibility and user satisfaction, and contributed insights into ALICE's potential for AI-driven educational technology.",
    },
  },
  {
    id: "bookthrift",
    title: "BookThrift Platform",
    description:
      "A book-marketplace platform built and led during a software development internship.",
    preview: "shop",
    tools: ["ASP.NET", "HTML", "CSS (Bootstrap)", "JavaScript", "SQL"],
    tags: ["sql", "javascript"],
    caseStudy: {
      ready: true,
      role: "Software Developer Intern, led development",
      timeframe: "Feb – Mar 2024 · Integr8 Software Solutions",
      problem:
        "A full platform build where performance, usability and clear team communication all mattered.",
      approach:
        "Led development of the BookThrift platform with ASP.NET, HTML, CSS (Bootstrap), JavaScript and SQL, optimized performance and usability, and used agile methods with regular progress updates to the team.",
      architecture: ["Users", "ASP.NET application", "SQL database", "Smoother experience"],
      outcome:
        "Delivered a working platform and earned a Certificate of Appreciation from Integr8 Software Solutions.",
    },
  },
];

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;
