
import { Category, ToolType, UIMode, ToolParameter } from '../types';
import { LucideIcon } from 'lucide-react';

export interface ToolDefinition {
  id: string;
  name: string;
  category: Category;
  description: string;
  toolType: ToolType;
  uiMode: UIMode;
  icon: LucideIcon;
  promptTemplate: string;
  placeholder?: string;
  systemInstruction?: string;
  parameters?: ToolParameter[];
  // Allows a tool to override the default UI with a specialized one
  workspaceComponent?: string; 
}
