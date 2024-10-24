// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '../../../utils/db';
import Transaction, { ITransaction } from '../../../models/Transaction';

const defaultTractionHeaders = ['accountName', 'cardNumber', 'transactionAmount', 'transactionType', 'description', 'targetCardNumber'];
// Define the field types for ITransaction
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fieldTypes: Record<any, any> = {
  accountName: 'string',
  cardNumber: 'number',
  transactionAmount: 'number',
  transactionType: 'string',
  description: 'string',
  targetCardNumber: 'number',
  isProcessed: 'boolean',
  isValid: 'boolean',
};

const isAPIRequestAuthorized = (req: NextRequest) => {
  const apiKey = req.headers.get('x-api-key');
  return apiKey?.trim() === process.env.API_KEY?.trim();
}

export async function POST(req: NextRequest) {
  // Run authMiddleware to check API key
  if (!isAPIRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDB();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read file as text
    const fileContent = await file.text();
    const transactionsJson = parseCsv(fileContent);

    const savedTransactions = await Transaction.insertMany(transactionsJson);
    return NextResponse.json({ message: 'Transactions uploaded successfully', data: { savedTransactionsCount: savedTransactions.length } });
  } catch (error) {
    return NextResponse.json({ error: `Failed to upload transactions: ${error}` }, { status: 500 });
  }
}


const parseCsv = (csvData: string): ITransaction[] => {
  // Split the CSV data into lines
  const lines = csvData.trim().split('\n');
  const result = [];

  // Extract headers from the first line
  const headers = defaultTractionHeaders //lines[0].split(',');

  // Iterate through the remaining lines to parse data rows
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rowData: any = {};

    // Map each row to the headers
    headers.forEach((header, index) => {
      const key = header.trim();
      const value = row[index]?.trim();
      const valueExists = value !== null && value !== undefined && value !== '';

      // Check if the header exists in the fieldTypes
      if (valueExists && key in fieldTypes) {
        switch (fieldTypes[key]) {
          case 'string':
            rowData[key] = value;
            break;
          case 'number':
            if (!isNaN(parseFloat(value))) {
              rowData[key] = parseFloat(value);
            }
            break;
          case 'boolean':
            rowData[key] = value?.toLowerCase() === 'true';
            break;
          default:
            rowData[key] = value;
        }
      }

      // Implement logic for setting isProcessed and isValid
      const { isValid, formattedTransaction } = validateTransaction(rowData);
      rowData.isValid = isValid;
      rowData.isProcessed = rowData.isValid; // Only process valid transactions
      rowData = formattedTransaction; // Update rowData with formatted transaction
    });

    result.push(rowData);
  }

  return result;
};

// Helper function to validate the transaction
const validateTransaction = (transaction: Partial<ITransaction>): { isValid: boolean, formattedTransaction: ITransaction } => {
  let isValid = true;
  const formattedTransaction = Object.assign(transaction);

  // Check for missing account name
  if (!transaction.accountName) {
    isValid = false;
  }

  if (!transaction.transactionType) {
    isValid = false;
  }

  // Check for valid transaction type
  if (!['Credit', 'Debit', 'Transfer'].includes(transaction.transactionType || '')) {
    transaction.transactionType = undefined

    isValid = false;
  }

  if (isNaN(parseFloat(transaction.transactionAmount?.toString() || ''))) {
    transaction.transactionAmount = undefined;
    isValid = false;
  }

  if (isNaN(parseFloat(transaction.cardNumber?.toString() || ''))) {
    transaction.cardNumber = undefined;
    isValid = false;
  }

  // Check for non-negative transaction amount
  if (transaction.transactionAmount === undefined || transaction.transactionAmount < 0) {
    isValid = false;
  }

  // Specific validation for Transfer transactions
  if (transaction.targetCardNumber && isNaN(transaction.targetCardNumber)) {
    transaction.targetCardNumber = undefined;
  }

  if (transaction.transactionType === 'Transfer' && !transaction.targetCardNumber) {
    isValid = false;
  }

  // If all validations pass, mark as valid
  return {
    isValid,
    formattedTransaction: formattedTransaction
  };
};
