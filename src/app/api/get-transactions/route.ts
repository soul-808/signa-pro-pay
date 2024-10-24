import { NextResponse } from 'next/server';
import Transaction from '../../../models/Transaction'; // Adjust the path as needed
import connectToDB from '../../../utils/db'; // Ensure the database is connected

// Function to get grouped transactions
async function getGroupedTransactions() {
    return await Transaction.aggregate([
        // 1. Group transactions by accountName and cardNumber
        {
            $group: {
                _id: { accountName: '$accountName', cardNumber: '$cardNumber' },
                totalAmount: { $sum: '$transactionAmount' },
                transactions: { $push: '$$ROOT' }
            }
        },
        // 2. Group by accountName again to create sub-groups for each cardNumber
        {
            $group: {
                _id: '$_id.accountName',
                cards: {
                    $push: {
                        cardNumber: '$_id.cardNumber',
                        totalAmount: '$totalAmount',
                        transactions: '$transactions'
                    }
                }
            }
        },
        // 3. Rename _id to accountName for better readability
        {
            $project: {
                _id: 0,
                accountName: '$_id',
                cards: 1
            }
        }
    ]);
}

// Handle the GET request for grouped transactions
export async function GET() {
    try {
        // Ensure MongoDB connection
        await connectToDB();

        // Get grouped transactions
        const groupedTransactions = await getGroupedTransactions();

        // Return response
        return NextResponse.json({ message: 'Grouped transactions fetched successfully', data: groupedTransactions });
    } catch (error) {
        console.error('Error fetching grouped transactions:', error);
        return NextResponse.json({ error: 'Failed to fetch grouped transactions' }, { status: 500 });
    }
}
