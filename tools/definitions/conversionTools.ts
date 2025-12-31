
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  FileJson, 
  FileCode, 
  Book, 
  Globe, 
  FileDigit,
  FileOutput,
  FileInput
} from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const conversionTools: ToolDefinition[] = [
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PowerPoint',
    category: Category.DOCUMENTS,
    toolType: 'conversion',
    // Added uiMode: processor for document conversion
    uiMode: 'processor',
    icon: Presentation,
    description: 'Analyze PDF layouts and reconstruct them as editable presentation slides.',
    promptTemplate: 'Convert this PDF content into a structured slide-by-slide outline suitable for PowerPoint, preserving visual hierarchies.',
  },
  {
    id: 'word-to-markdown',
    name: 'Word to Markdown',
    category: Category.DOCUMENTS,
    toolType: 'conversion',
    // Added uiMode: processor for document conversion
    uiMode: 'processor',
    icon: FileCode,
    description: 'Convert DOCX files into clean, documentation-ready Markdown.',
    promptTemplate: 'Convert the following document into clean Github-flavored Markdown. Ensure tables and lists are perfectly formatted.',
  },
  {
    id: 'csv-to-excel-pro',
    name: 'CSV to Spreadsheet',
    category: Category.DATA,
    toolType: 'conversion',
    // Added uiMode: lab for data processing
    uiMode: 'lab',
    icon: FileSpreadsheet,
    description: 'Intelligently format raw CSV data into styled spreadsheet structures with data type detection.',
    promptTemplate: 'Analyze this CSV data. Identify headers and data types, and suggest professional styling (colors, borders, number formats) for an Excel export.',
  },
  {
    id: 'json-to-excel-data',
    name: 'JSON to Spreadsheet',
    category: Category.DATA,
    toolType: 'conversion',
    // Added uiMode: lab for data processing
    uiMode: 'lab',
    icon: FileDigit,
    description: 'Flatten complex, nested JSON objects into row-based spreadsheet data.',
    promptTemplate: 'Take this nested JSON and flatten it into a 2D table format suitable for a spreadsheet. Handle arrays with comma-separated values.',
  },
  {
    id: 'epub-to-pdf-content',
    name: 'EPUB to PDF Layout',
    category: Category.DOCUMENTS,
    toolType: 'conversion',
    // Added uiMode: processor for document conversion
    uiMode: 'processor',
    icon: Book,
    description: 'Re-paginate ebook content for standard printable document formats.',
    promptTemplate: 'Analyze this EPUB content and generate a high-quality, re-paginated layout for a standard A4 PDF document.',
  },
  {
    id: 'html-to-pdf-clean',
    name: 'Web to PDF (Clean)',
    category: Category.DOCUMENTS,
    toolType: 'conversion',
    // Added uiMode: processor for document conversion
    uiMode: 'processor',
    icon: Globe,
    description: 'Extract web content and reformat into professional multi-page PDF documents.',
    promptTemplate: 'Extract the main content from this HTML and create a clean, printable document layout with headers and page numbers.',
  },
  {
    id: 'rtf-to-word-format',
    name: 'RTF to DOCX',
    category: Category.DOCUMENTS,
    toolType: 'conversion',
    // Added uiMode: processor for document conversion
    uiMode: 'processor',
    icon: FileText,
    description: 'Upgrade old Rich Text Format files to modern, structured Word documents.',
    promptTemplate: 'Convert this RTF content into a modern, structured document format, fixing any legacy encoding issues.',
  },
  {
    id: 'xml-to-json-mapper',
    name: 'XML to JSON Pro',
    category: Category.DATA,
    toolType: 'conversion',
    // Added uiMode: lab for data processing
    uiMode: 'lab',
    icon: FileJson,
    description: 'Direct mapping of XML nodes to JSON attributes for API integration.',
    promptTemplate: 'Convert this XML into a strictly typed JSON object. Maintain all attribute and child relationships.',
  },
  {
    id: 'latex-to-pdf-scribe',
    name: 'LaTeX Content Parser',
    category: Category.TECH,
    toolType: 'conversion',
    // Added uiMode: lab for technical text processing
    uiMode: 'lab',
    icon: FileInput,
    description: 'Parse LaTeX source code into readable text or formatted layouts.',
    promptTemplate: 'Parse the following LaTeX code and provide a clean text representation of the mathematical formulas and document structure.',
  }
];