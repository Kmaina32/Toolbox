
export enum Category {
  DOCUMENTS = 'Document & PDF Tools',
  IMAGES = 'Image & Visual Utils',
  AUDIO_VIDEO = 'Audio & Video Units',
  DATA = 'Data & Code Utilities',
  BUSINESS = 'Business Automation',
  SEO_CONTENT = 'SEO & Content Tools',
  CONTENT = 'Content Creation',
  DESIGN = 'Design & Creative',
  PRODUCTIVITY = 'Productivity',
  TECH = 'Technical & Coding',
  NICHE = 'Specialized Tools',
  EDUCATION = 'Education & Learning',
  METADATA = 'Metadata Management',
  FORENSICS = 'Forensics & Privacy'
}

export type ToolType = 'conversion' | 'extraction' | 'generation' | 'optimization' | 'text' | 'image' | 'chat';

export type UIMode = 'processor' | 'studio' | 'lab' | 'desk' | 'chat' | 'bulk';

export interface ToolParameter {
  id: string;
  label: string;
  type: 'select' | 'slider' | 'toggle' | 'text' | 'coordinate-picker' | 'date-range';
  options?: { label: string; value: string }[];
  default: any;
}

export interface SaaSItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  toolType: ToolType;
  icon: any;
  promptTemplate: string;
}

export interface HistoryItem {
  id: string;
  toolId: string;
  timestamp: number;
  input: string;
  output: string;
}
