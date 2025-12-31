
import { Plane } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const travelItinerary: ToolDefinition = {
  id: 'travel-planner',
  name: 'Globe Trotter',
  category: Category.NICHE,
  toolType: 'text',
  // Set uiMode to desk for general text-based output
  uiMode: 'desk',
  icon: Plane,
  description: 'Craft personalized multi-day travel experiences anywhere.',
  placeholder: 'Tokyo for 7 days with a focus on food and technology...',
  promptTemplate: 'Create a detailed day-by-day travel itinerary for the following request. Include morning, afternoon, and evening activities, plus 2 restaurant recommendations per day:\n\n'
};