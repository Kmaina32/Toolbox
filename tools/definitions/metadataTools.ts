
import { Info, Scan, Calendar, MapPin, Camera, Video, FileSearch } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const metadataTools: ToolDefinition[] = [
  {
    id: 'exif-master-view',
    name: 'EXIF Master Viewer',
    category: Category.METADATA,
    toolType: 'extraction',
    uiMode: 'processor',
    icon: Info,
    workspaceComponent: 'MetadataWorkspace',
    description: 'Complete inspection of Image EXIF, IPTC, and XMP. View camera settings, lens data, and creator info.',
    promptTemplate: 'Extract all available metadata from this image. Categorize it into Technical (Aperture, ISO, Sensor), Creator (Copyright, Author), and Location (GPS). Format the output as a clean, structured report.',
  },
  {
    id: 'gps-geo-editor',
    name: 'GeoTagger AI',
    category: Category.METADATA,
    toolType: 'optimization',
    uiMode: 'processor',
    icon: MapPin,
    workspaceComponent: 'MapWorkspace',
    description: 'Change or add GPS coordinates to your photos using AI-assisted location matching.',
    promptTemplate: 'Analyze the landscape and metadata of this image. If GPS exists, display it. If not, suggest a likely location based on visual landmarks.',
  },
  {
    id: 'exif-stripper',
    name: 'Privacy Stripper',
    category: Category.METADATA,
    toolType: 'optimization',
    uiMode: 'processor',
    icon: Scan,
    description: 'Sanitize images for social media. Removes all GPS, camera IDs, and personal metadata.',
    promptTemplate: 'Identify every piece of identifying metadata in this file. Provide a confirmation of what needs to be scrubbed for absolute anonymity.',
  }
];
