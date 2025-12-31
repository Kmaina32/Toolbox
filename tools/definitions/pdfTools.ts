
import { Scissors, Layers, Minimize2, Lock, EyeOff, FileSignature, CheckSquare, Search, FileDiff, FileText } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const pdfTools: ToolDefinition[] = [
  {
    id: 'pdf-redactor',
    name: 'Smart Redactor',
    category: Category.DOCUMENTS,
    toolType: 'optimization',
    // Added uiMode: processor for file processing
    uiMode: 'processor',
    icon: EyeOff,
    description: 'AI-assisted redaction. Automatically identifies PII (emails, names, numbers) for removal.',
    promptTemplate: 'Identify all PII (Personally Identifiable Information) like names, phone numbers, addresses, and emails in this document. Provide a list of segments that should be redacted.',
  },
  {
    id: 'pdf-ocr-enhancer',
    name: 'Scan Enhancer (OCR)',
    category: Category.DOCUMENTS,
    toolType: 'extraction',
    // Added uiMode: processor for file processing
    uiMode: 'processor',
    icon: Search,
    description: 'Transform low-quality scans into high-fidelity searchable text with AI correction.',
    promptTemplate: 'Perform deep OCR on this image/PDF. Correct any obvious scanning errors, misspellings, or formatting glitches to produce a perfect text version.',
  },
  {
    id: 'invoice-parser',
    name: 'Invoice Intelligence',
    category: Category.BUSINESS,
    toolType: 'extraction',
    // Added uiMode: processor for file processing
    uiMode: 'processor',
    icon: FileText,
    description: 'Extract vendor, line items, taxes, and totals from invoices into structured data.',
    promptTemplate: 'Extract all invoice data including vendor details, date, invoice number, items list (description, quantity, price), tax, and total. Format as a structured table.',
  },
  {
    id: 'pdf-form-flattener',
    name: 'Form Intelligence',
    category: Category.DOCUMENTS,
    toolType: 'extraction',
    // Added uiMode: processor for file processing
    uiMode: 'processor',
    icon: CheckSquare,
    description: 'Analyze filled PDF forms and extract responses into a database-ready format.',
    promptTemplate: 'Identify all form fields in this document and their corresponding values. Provide the data in a clean key-value pair format.',
  },
  {
    id: 'pdf-contract-analyzer',
    name: 'Contract Lens',
    category: Category.BUSINESS,
    toolType: 'extraction',
    // Added uiMode: processor for file processing
    uiMode: 'processor',
    icon: FileSignature,
    description: 'Identify critical clauses, termination rights, and liabilities in legal documents.',
    promptTemplate: 'Review this contract and list all: 1. Governing Law, 2. Termination Rights, 3. Indemnification Clauses, 4. Payment Terms, 5. Significant Liabilities.',
  },
  {
    id: 'pdf-metadata-cleaner',
    name: 'Metadata Scrub',
    category: Category.DOCUMENTS,
    toolType: 'optimization',
    // Added uiMode: processor for file processing
    uiMode: 'processor',
    icon: Minimize2,
    description: 'Identify and prepare metadata removal to sanitize files for public distribution.',
    promptTemplate: 'Analyze this file for hidden metadata, author information, revision history, and embedded comments. List everything that should be cleaned.',
  }
];