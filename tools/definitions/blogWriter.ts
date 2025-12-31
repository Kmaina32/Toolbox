
import { Edit3 } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const blogWriter: ToolDefinition = {
  id: 'blog-writer',
  name: 'AI Blog Architect',
  category: Category.CONTENT,
  toolType: 'text',
  // Set uiMode to desk for text-focused content creation
  uiMode: 'desk',
  icon: Edit3,
  description: 'Generate SEO-optimized blog posts with compelling narratives.',
  placeholder: 'Enter a topic or keywords...',
  promptTemplate: 'Write a 1000-word SEO-friendly blog post about the following topic. Include an H1, multiple H2s, a conclusion, and 3 FAQ questions:\n\n',
  systemInstruction: 'You are a professional content marketer and SEO specialist.'
};