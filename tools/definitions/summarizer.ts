
import { FileText } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const summarizer: ToolDefinition = {
  id: 'summarizer',
  name: 'Doc2Summary',
  category: Category.DOCUMENTS,
  toolType: 'extraction',
  // Set uiMode to processor as it handles file uploads
  uiMode: 'processor',
  icon: FileText,
  description: 'AI-powered document compression. Upload any PDF or text for a structured summary.',
  placeholder: 'Paste extra context or instructions (optional)...',
  promptTemplate: 'Please analyze this document and provide a structured summary including: 1. Core Purpose, 2. Key Statistics/Data, 3. Critical Deadlines, 4. Action Items.',
  systemInstruction: 'You are a high-level research analyst trained to extract signal from noise in business and technical documents.'
};