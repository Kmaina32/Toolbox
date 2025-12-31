
import { ClipboardList } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const meetingNotes: ToolDefinition = {
  id: 'meeting-notes',
  name: 'Smart Scribe',
  category: Category.PRODUCTIVITY,
  toolType: 'text',
  // Set uiMode to desk for text transformation tasks
  uiMode: 'desk',
  icon: ClipboardList,
  description: 'Convert messy transcripts into polished meeting minutes.',
  placeholder: 'Paste your transcript here...',
  promptTemplate: 'Format the following meeting transcript into structured notes with: 1. Participants, 2. Key Decisions, 3. Action Items (assigned to owners), 4. Next Steps:\n\n'
};