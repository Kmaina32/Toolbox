
import { Category, ToolType, UIMode, ToolParameter } from '../types';
import { LucideIcon } from 'lucide-react';

export interface ToolDefinition {
  id: string;
  name: string;
  category: Category;
  description: string;
  toolType: ToolType;
  uiMode: UIMode; // New field to drive component selection
  icon: LucideIcon;
  promptTemplate: string;
  placeholder?: string;
  systemInstruction?: string;
  parameters?: ToolParameter[]; // New field for tool-specific settings
}
