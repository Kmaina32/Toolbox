
import { Rocket } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const businessValidator: ToolDefinition = {
  id: 'business-validator',
  name: 'Idea Forge',
  category: Category.BUSINESS,
  toolType: 'text',
  // Set uiMode to desk for business reasoning and planning
  uiMode: 'desk',
  icon: Rocket,
  description: 'Stress-test your startup ideas with AI-driven market analysis.',
  placeholder: 'A subscription box for rare indoor plants...',
  promptTemplate: 'Validate the following business idea. Provide: 1. Market Potential, 2. Potential Competitors, 3. Suggested Monetization, 4. Critical Risks, 5. First 3 steps to launch:\n\n'
};