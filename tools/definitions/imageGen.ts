
import { Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const imageGen: ToolDefinition = {
  id: 'image-gen',
  name: 'Creative Visionary',
  category: Category.DESIGN,
  toolType: 'image',
  uiMode: 'studio',
  icon: ImageIcon,
  description: 'High-fidelity visual synthesis. Transform abstract text prompts into cinematic digital art.',
  placeholder: 'A futuristic city at sunset with neon lights, volumetric lighting, 8k resolution...',
  promptTemplate: '', 
  systemInstruction: 'You are a master digital artist. Generate high-quality images based on descriptive prompts. Focus on lighting, texture, and composition.',
  parameters: [
    { id: 'ratio', label: 'Aspect Ratio', type: 'select', default: '1:1', options: [{label: '1:1 Square', value: '1:1'}, {label: '16:9 Cinema', value: '16:9'}, {label: '9:16 Portrait', value: '9:16'}] },
    { id: 'style', label: 'Artistic Style', type: 'select', default: 'cinematic', options: [{label: 'Cinematic', value: 'cinematic'}, {label: 'Cyberpunk', value: 'cyberpunk'}, {label: 'Oil Painting', value: 'oil'}, {label: '3D Render', value: '3d'}] }
  ]
};
