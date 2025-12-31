
import { User } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const personalTutor: ToolDefinition = {
  id: 'ai-tutor',
  name: 'Personal Mentor',
  category: Category.EDUCATION,
  toolType: 'text',
  uiMode: 'desk',
  icon: User,
  description: 'Adaptive learning assistant. Simplifies complex theories and provides structured curriculum paths.',
  placeholder: 'Explain quantum entanglement like I am 5...',
  promptTemplate: 'You are a master tutor. Explain the following concept clearly, use analogies, and end with a quick check-for-understanding question.',
  parameters: [
    { id: 'level', label: 'Complexity Level', type: 'select', default: 'beginner', options: [{label: 'Beginner', value: 'beginner'}, {label: 'Intermediate', value: 'intermediate'}, {label: 'Advanced', value: 'expert'}]}
  ]
};
