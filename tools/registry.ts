
import { ToolDefinition } from './base';
import { summarizer } from './definitions/summarizer';
import { receiptExtractor } from './definitions/receiptExtractor';
import { resumeParser } from './definitions/resumeParser';
import { blogWriter } from './definitions/blogWriter';
import { imageGen } from './definitions/imageGen';
import { codeExplainer } from './definitions/codeExplainer';
import { businessValidator } from './definitions/businessValidator';
import { travelItinerary } from './definitions/travelItinerary';
import { fileTools } from './definitions/fileTools';
import { pdfTools } from './definitions/pdfTools';
import { imageTools } from './definitions/imageTools';
import { multimediaTools } from './definitions/multimediaTools';
import { conversionTools } from './definitions/conversionTools';
import { bulkConverter } from './definitions/bulkConverter';
import { metadataTools } from './definitions/metadataTools';
import { forensicsTools } from './definitions/forensicsTools';

// The master registry of all available SaaS utility tools
export const TOOL_REGISTRY: ToolDefinition[] = [
  ...metadataTools,
  ...forensicsTools,
  ...fileTools,
  ...pdfTools,
  ...imageTools,
  ...multimediaTools,
  ...conversionTools,
  bulkConverter,
  summarizer,
  receiptExtractor,
  resumeParser,
  blogWriter,
  imageGen,
  codeExplainer,
  businessValidator,
  travelItinerary
];

export const getToolById = (id: string) => TOOL_REGISTRY.find(t => t.id === id);
