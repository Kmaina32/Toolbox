
import { 
  Megaphone, 
  Users, 
  Gavel, 
  CreditCard, 
  ShieldCheck, 
  Cpu, 
  HeartPulse, 
  ShoppingBag, 
  Zap, 
  Target,
  BarChart,
  MessageCircle,
  Stethoscope,
  Home,
  Code2,
  Lock,
  Mail,
  PieChart,
  Trello,
  Briefcase
} from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const marketingTools: ToolDefinition[] = [
  {
    id: 'viral-hook-gen',
    name: 'Viral Hook Engine',
    category: Category.SEO_CONTENT,
    toolType: 'text',
    uiMode: 'desk',
    icon: Megaphone,
    description: 'Generate 10 high-conversion hooks for TikTok, Reels, and X threads.',
    promptTemplate: 'Generate 10 viral hooks for the following topic. Focus on psychological triggers like curiosity, fear of missing out, or contrarian takes: '
  },
  {
    id: 'seo-semantic-mapper',
    name: 'SEO Semantic Map',
    category: Category.SEO_CONTENT,
    toolType: 'extraction',
    uiMode: 'lab',
    icon: Target,
    description: 'Build a semantic keyword map for a primary keyword to dominate search clusters.',
    promptTemplate: 'Create a semantic keyword map for the primary keyword provided. Identify LSI keywords, search intent (informational, transactional), and suggested H2 headings.'
  },
  {
    id: 'ad-copy-optimizer',
    name: 'AdCopy Optimizer',
    category: Category.SEO_CONTENT,
    toolType: 'optimization',
    uiMode: 'desk',
    icon: Zap,
    description: 'Re-write low-performing ad copy into high-CTR variations based on AIDA framework.',
    promptTemplate: 'Rewrite the following ad copy using the AIDA (Attention, Interest, Desire, Action) framework to maximize click-through rate: '
  }
];

export const hrTools: ToolDefinition[] = [
  {
    id: 'job-bias-detector',
    name: 'BiasGuard HR',
    category: Category.BUSINESS,
    toolType: 'optimization',
    uiMode: 'processor',
    icon: Users,
    description: 'Scan job descriptions for gender, age, or cultural bias to improve diversity.',
    promptTemplate: 'Scan this job description for any implicit biases. Suggest more inclusive alternatives while maintaining a professional tone.'
  },
  {
    id: 'performance-review-helper',
    name: 'Review Architect',
    category: Category.PRODUCTIVITY,
    toolType: 'text',
    uiMode: 'desk',
    icon: PieChart,
    description: 'Transform rough bullet points into professional, constructive performance reviews.',
    promptTemplate: 'Convert these rough notes about an employee into a professional, balanced performance review with clear growth areas and achievements: '
  }
];

export const legalTools: ToolDefinition[] = [
  {
    id: 'tos-summarizer',
    name: 'TOS Decoder',
    category: Category.FORENSICS,
    toolType: 'extraction',
    uiMode: 'processor',
    icon: Gavel,
    description: 'Identify red flags, data sharing policies, and hidden costs in Terms of Service.',
    promptTemplate: 'Analyze this Terms of Service agreement. List: 1. Data Sharing Rules, 2. Automatic Billing/Cancellation terms, 3. Liability waivers, 4. Red flags.'
  },
  {
    id: 'gdpr-checker',
    name: 'GDPR Privacy Audit',
    category: Category.FORENSICS,
    toolType: 'extraction',
    uiMode: 'processor',
    icon: ShieldCheck,
    description: 'Scan privacy policies for GDPR and CCPA compliance gaps.',
    promptTemplate: 'Audit this privacy policy for GDPR compliance. Identify missing sections regarding data portability, the right to be forgotten, and DPO contact info.'
  }
];

export const devTools: ToolDefinition[] = [
  {
    id: 'regex-wizard',
    name: 'Regex Oracle',
    category: Category.TECH,
    toolType: 'generation',
    uiMode: 'lab',
    icon: Code2,
    description: 'Describe what you want to match, and get a perfectly escaped Regex string.',
    promptTemplate: 'Generate a high-performance Regular Expression for the following requirement. Explain the capture groups used: '
  },
  {
    id: 'sql-optimizer',
    name: 'Query Refiner',
    category: Category.TECH,
    toolType: 'optimization',
    uiMode: 'lab',
    icon: BarChart,
    description: 'Analyze SQL queries for bottlenecks and suggest indexing or join optimizations.',
    promptTemplate: 'Optimize this SQL query for performance. Suggest indexes and identify potential full-table scans: '
  },
  {
    id: 'git-commit-gen',
    name: 'Commit Master',
    category: Category.TECH,
    toolType: 'text',
    uiMode: 'lab',
    icon: Zap,
    description: 'Turn messy code diffs into clean, conventional commit messages.',
    promptTemplate: 'Generate a Conventional Commit message (feat, fix, chore) based on the following code changes: '
  }
];

export const productTools: ToolDefinition[] = [
  {
    id: 'user-persona-builder',
    name: 'Persona Factory',
    category: Category.BUSINESS,
    toolType: 'generation',
    uiMode: 'desk',
    icon: Target,
    description: 'Generate detailed user personas including pain points, tech stack, and buying triggers.',
    promptTemplate: 'Create 3 detailed user personas for a new SaaS product in the following niche. Include goals, frustrations, and preferred marketing channels: '
  },
  {
    id: 'feature-prioritizer',
    name: 'RICE Scorecard',
    category: Category.PRODUCTIVITY,
    toolType: 'text',
    uiMode: 'desk',
    icon: Trello,
    description: 'Calculate RICE scores (Reach, Impact, Confidence, Effort) for product features.',
    promptTemplate: 'Based on the following feature list, assign estimated RICE scores and rank them in priority order for a development sprint: '
  }
];

export const nicheSaaS: ToolDefinition[] = [
  {
    id: 'newsletter-curator',
    name: 'Substack Scout',
    category: Category.CONTENT,
    toolType: 'text',
    uiMode: 'desk',
    icon: Mail,
    description: 'Summarize the week\'s top news in a niche into a curated newsletter format.',
    promptTemplate: 'Curate a weekly newsletter draft based on these news snippets. Group into "Top Story", "Quick Hits", and "Deep Dive": '
  },
  {
    id: 'realestate-analyst',
    name: 'Prop-Tech Vision',
    category: Category.NICHE,
    toolType: 'extraction',
    uiMode: 'processor',
    icon: Home,
    description: 'Extract zoning data, square footage, and property history from listing photos or PDFs.',
    promptTemplate: 'Analyze this property listing data and provide a summary of ROI potential, tax history, and comparative market analysis.'
  }
];

export const saasIdeasRegistry: ToolDefinition[] = [
  ...marketingTools,
  ...hrTools,
  ...legalTools,
  ...devTools,
  ...productTools,
  ...nicheSaaS
];
