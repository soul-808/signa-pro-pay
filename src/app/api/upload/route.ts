// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '../../../utils/db';
import Transaction from '../../../models/Transaction';
import authMiddleware from '../../../utils/authMiddleware';

export async function POST(req: NextRequest) {
  // Run authMiddleware to check API key
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Connect to MongoDB
  await connectToDB();

  try {
    const { transactions } = await req.json();
    const savedTransactions = await Transaction.insertMany(transactions);
    return NextResponse.json({ message: 'Transactions uploaded successfully', data: savedTransactions });
  } catch (error) {
    return NextResponse.json({ error: `Failed to upload transactions: ${error}` }, { status: 500 });
  }
}
