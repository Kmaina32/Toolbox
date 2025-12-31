
import { ShieldCheck, Fingerprint, SearchCheck, Lock, UserX, AlertTriangle, FileCheck } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const forensicsTools: ToolDefinition[] = [
  {
    id: 'deepfake-detector',
    name: 'Deepfake Sentinel',
    category: Category.FORENSICS,
    toolType: 'extraction',
    uiMode: 'processor',
    icon: UserX,
    description: 'Analyze videos and images for AI-generated artifacts, facial inconsistencies, and unnatural motion.',
    promptTemplate: 'Perform a forensic analysis on this media to detect signs of AI generation. Look for blending artifacts, lighting inconsistencies, and unnatural textures.',
    systemInstruction: 'You are a digital forensics expert. Be critical and look for minute pixel-level inconsistencies typical of generative AI.'
  },
  {
    id: 'image-tamper-scan',
    name: 'Authenticity Checker',
    category: Category.FORENSICS,
    toolType: 'extraction',
    uiMode: 'processor',
    icon: SearchCheck,
    description: 'Identify if an image has been edited using Error Level Analysis (ELA) and clone detection logic.',
    promptTemplate: 'Scan this image for signs of digital manipulation (cloning, healing, or compositing). Identify areas of inconsistent compression or light direction.',
  },
  {
    id: 'camera-fingerprinter',
    name: 'Source Tracer',
    category: Category.FORENSICS,
    toolType: 'extraction',
    uiMode: 'processor',
    icon: Fingerprint,
    description: 'Analyze sensor noise patterns to match an image to a specific camera model or device.',
    promptTemplate: 'Extract technical artifacts that identify the specific hardware sensor used to capture this image. Provide a "fingerprint" report of the device.',
  },
  {
    id: 'whistleblower-toolkit',
    name: 'Secure Upload Sanitizer',
    category: Category.FORENSICS,
    toolType: 'optimization',
    uiMode: 'processor',
    icon: Lock,
    description: 'The gold standard for secure media sharing. Strips every trace of identity before publication.',
    promptTemplate: 'Perform a multi-pass sanitization analysis. Identify PII in text, metadata in files, and identifying background objects in images.',
  },
  {
    id: 'legal-evidence-validator',
    name: 'Chain-of-Custody Scribe',
    category: Category.FORENSICS,
    toolType: 'extraction',
    uiMode: 'processor',
    icon: FileCheck,
    description: 'Generates a forensic integrity report for digital evidence including hashes and timestamps.',
    promptTemplate: 'Generate a formal integrity report for this file. Include SHA-256 hashes, creation timeline, and a metadata consistency check for court use.',
  }
];
