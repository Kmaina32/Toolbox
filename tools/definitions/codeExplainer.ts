
import { Code } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const codeExplainer: ToolDefinition = {
  id: 'code-explainer',
  name: 'Code Decipher',
  category: Category.TECH,
  toolType: 'text',
  // Set uiMode to lab for technical and code analysis
  uiMode: 'lab',
  icon: Code,
  description: 'Break down complex logic into human-readable explanations.',
  placeholder: 'Paste your code snippet here...',
  promptTemplate: 'Explain exactly what this code does in simple terms. Breakdown the logic line-by-line and explain any complex algorithms used:\n\n'
};