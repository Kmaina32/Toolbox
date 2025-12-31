
import { ImageIcon, Maximize, Scissors, Palette, Sun, Eraser, UserCheck, ShieldCheck, CreditCard } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const imageTools: ToolDefinition[] = [
  {
    id: 'bg-remover-vision',
    name: 'AI Background Sense',
    category: Category.IMAGES,
    toolType: 'optimization',
    // Added uiMode: processor for visual processing
    uiMode: 'processor',
    icon: Eraser,
    description: 'Describe the subject you want to keep. AI identifies the foreground for precise isolation.',
    promptTemplate: 'Identify the main subject in this image and describe the precise clipping path to remove the background.',
  },
  {
    id: 'image-to-text-pro',
    name: 'Visual Text Extractor',
    category: Category.IMAGES,
    toolType: 'extraction',
    // Added uiMode: processor for visual processing
    uiMode: 'processor',
    icon: ImageIcon,
    description: 'Extract text from any image, including complex layouts and handwritten notes.',
    promptTemplate: 'Extract every piece of text from this image. Maintain the original reading order and layout structure.',
  },
  {
    id: 'id-photo-gen',
    name: 'ID Photo Validator',
    category: Category.BUSINESS,
    toolType: 'optimization',
    // Added uiMode: processor for visual processing
    uiMode: 'processor',
    icon: UserCheck,
    description: 'Check if an image meets passport/ID requirements and suggest adjustments.',
    promptTemplate: 'Analyze this portrait for ID/Passport compliance. Check: 1. Lighting, 2. Background color, 3. Face positioning, 4. Expression. Provide a pass/fail report.',
  },
  {
    id: 'image-color-corrector',
    name: 'Smart Color Balance',
    category: Category.IMAGES,
    toolType: 'optimization',
    // Added uiMode: processor for visual processing
    uiMode: 'processor',
    icon: Palette,
    description: 'Describe a desired mood or fix lighting issues. AI generates color grading instructions.',
    promptTemplate: 'Analyze the lighting and colors of this image. Provide specific color correction values (white balance, tint, exposure) to make it look professional and cinematic.',
  },
  {
    id: 'blur-faces-ai',
    name: 'Privacy Guard (Face Blur)',
    category: Category.IMAGES,
    toolType: 'optimization',
    // Added uiMode: processor for visual processing
    uiMode: 'processor',
    icon: ShieldCheck,
    description: 'Automatically detects faces in crowds for privacy-focused processing.',
    promptTemplate: 'Identify all human faces in this image and provide coordinates for blurring to ensure privacy.',
  }
];