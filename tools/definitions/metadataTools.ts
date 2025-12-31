
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
    description: 'Complete inspection of Image EXIF, IPTC, and XMP. View camera settings, lens data, and creator info.',
    promptTemplate: 'Extract all available metadata from this image. Categorize it into Technical (Aperture, ISO), Creator (Copyright, Author), and Location (GPS).',
  },
  {
    id: 'exif-stripper',
    name: 'Privacy Stripper',
    category: Category.METADATA,
    toolType: 'optimization',
    uiMode: 'processor',
    icon: Scan,
    description: 'Sanitize images for social media. Removes all GPS, camera IDs, and personal metadata.',
    promptTemplate: 'Analyze this file for sensitive metadata (GPS, serial numbers, user IDs). Provide a list of all fields that should be removed to ensure 100% privacy.',
  },
  {
    id: 'gps-geo-editor',
    name: 'GeoTagger AI',
    category: Category.METADATA,
    toolType: 'optimization',
    uiMode: 'processor',
    icon: MapPin,
    description: 'Change or add GPS coordinates to your photos using AI-assisted location matching.',
    promptTemplate: 'Based on the visual content of this image and the user instructions, suggest or update the GPS metadata (lat/long) for the file.',
  },
  {
    id: 'video-codec-analyst',
    name: 'Video Container Pro',
    category: Category.METADATA,
    toolType: 'extraction',
    uiMode: 'processor',
    icon: Video,
    description: 'Deep inspection of video streams, bitrates, frame rates, and container metadata.',
    promptTemplate: 'Provide a technical analysis of this video container. Include codec details, stream hierarchy, integrated bitrates, and duration validation.',
  },
  {
    id: 'pdf-anonymizer',
    name: 'Document Scrubber',
    category: Category.METADATA,
    toolType: 'optimization',
    uiMode: 'processor',
    icon: FileSearch,
    description: 'Remove author info, revision history, and hidden comments from PDF and Word files.',
    promptTemplate: 'Locate all hidden metadata in this document: author names, company info, creation dates, and track-changes history. List them for removal.',
  }
];
