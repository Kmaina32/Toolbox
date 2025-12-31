
import React from 'react';
import { Category } from './types';
import { 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Database, 
  Briefcase, 
  Search,
  ShieldAlert,
  Info
} from 'lucide-react';

export const CATEGORIES = [
  { id: Category.DOCUMENTS, icon: FileText, color: 'bg-blue-500' },
  { id: Category.IMAGES, icon: ImageIcon, color: 'bg-indigo-500' },
  { id: Category.AUDIO_VIDEO, icon: Music, color: 'bg-purple-500' },
  { id: Category.DATA, icon: Database, color: 'bg-emerald-500' },
  { id: Category.METADATA, icon: Info, color: 'bg-cyan-500' },
  { id: Category.FORENSICS, icon: ShieldAlert, color: 'bg-red-500' },
  { id: Category.BUSINESS, icon: Briefcase, color: 'bg-orange-500' },
  { id: Category.SEO_CONTENT, icon: Search, color: 'bg-pink-500' },
];
