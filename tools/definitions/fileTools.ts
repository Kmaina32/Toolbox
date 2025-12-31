
import { FileText, FileCode, FileJson, FileSpreadsheet, Globe, BookOpen, Mail, MessageSquare } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const fileTools: ToolDefinition[] = [
  {
    id: 'pdf-to-word',
    name: 'PDF to Word (AI)',
    category: Category.DOCUMENTS,
    toolType: 'conversion',
    uiMode: 'processor',
    icon: FileText,
    description: 'Intelligent layout preservation. Converts PDF content into editable, structured document format.',
    promptTemplate: 'Convert the content of this document into a high-quality, structured Markdown document that preserves headings, lists, and tables. Ensure the text is clean and editable.',
    parameters: [
      { id: 'layout', label: 'Layout Retention', type: 'select', default: 'exact', options: [{label: 'Exact', value: 'exact'}, {label: 'Clean/Minimal', value: 'clean'}] }
    ]
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON Engine',
    category: Category.DATA,
    toolType: 'conversion',
    uiMode: 'lab',
    icon: FileJson,
    description: 'Transform flat CSV data into hierarchical JSON objects for API consumption.',
    placeholder: 'Paste CSV raw text or upload file...',
    promptTemplate: 'Convert this CSV data into a clean, well-formatted JSON array of objects. Map columns to keys intelligently.',
    parameters: [
      { id: 'indent', label: 'JSON Indentation', type: 'select', default: '2', options: [{label: '2 Spaces', value: '2'}, {label: '4 Spaces', value: '4'}, {label: 'Minified', value: '0'}]}
    ]
  }
];
