
import { Files } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const bulkConverter: ToolDefinition = {
  id: 'bulk-file-converter',
  name: 'Bulk Converto',
  category: Category.DOCUMENTS,
  toolType: 'conversion',
  uiMode: 'bulk',
  icon: Files,
  description: 'Batch process multiple files simultaneously. Convert PDF, Word, and images to any target format in one click.',
  placeholder: 'Apply custom formatting to all files...',
  promptTemplate: 'Analyze the provided file and convert it strictly into the target format specified in settings. Preserve structural integrity.',
  systemInstruction: 'You are a high-speed batch file processing engine. Your goal is to convert input documents into high-quality target formats with zero layout shifting.',
  parameters: [
    { 
      id: 'format', 
      label: 'Target Format', 
      type: 'select', 
      default: 'pdf', 
      options: [
        {label: 'PDF Document', value: 'pdf'}, 
        {label: 'MS Word (DOCX)', value: 'docx'}, 
        {label: 'Plain Text (TXT)', value: 'txt'},
        {label: 'Markdown (MD)', value: 'md'}
      ] 
    },
    { 
      id: 'quality', 
      label: 'OCR Accuracy', 
      type: 'select', 
      default: 'balanced', 
      options: [
        {label: 'Speed Optimized', value: 'speed'}, 
        {label: 'Balanced', value: 'balanced'}, 
        {label: 'Precision (High-Def)', value: 'precision'}
      ] 
    }
  ]
};
