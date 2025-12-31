
import { UserCircle } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const resumeParser: ToolDefinition = {
  id: 'resume-parser',
  name: 'Resume Insight',
  category: Category.DOCUMENTS,
  toolType: 'extraction',
  // Set uiMode to processor for document analysis
  uiMode: 'processor',
  icon: UserCircle,
  description: 'Parse PDF resumes into clean, structured datasets for ATS or databases.',
  placeholder: 'Specific skills to look for...',
  promptTemplate: 'Extract contact details, work history, education, and top 10 skills from this resume. Format the response with clear headers and bullet points.',
  systemInstruction: 'You are a professional HR data analyst specializing in candidate profiling.'
};