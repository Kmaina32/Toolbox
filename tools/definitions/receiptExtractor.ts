
import { Receipt } from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const receiptExtractor: ToolDefinition = {
  id: 'receipt-to-data',
  name: 'Receipt Intelligence',
  category: Category.BUSINESS,
  toolType: 'extraction',
  // Set uiMode to processor as it handles receipt image processing
  uiMode: 'processor',
  icon: Receipt,
  description: 'Extract line items, taxes, and vendor info from receipt images directly into JSON format.',
  placeholder: 'Add expense category or project code (optional)...',
  promptTemplate: 'Extract all data from this receipt image. Format as a clear table and also provide a JSON block with merchant, date, total_amount, currency, and line_items.',
  systemInstruction: 'You are an expert accounting AI. Be extremely precise with numbers and currency symbols.'
};