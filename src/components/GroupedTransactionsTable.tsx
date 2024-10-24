import { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Collapse, Box, Typography
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Warning } from '@mui/icons-material';
import { ITransaction } from '@/models/Transaction';

const ColorPalette = {
    green: '#388e3c',
    red: '#d32f2f',
    white: '#f5f5f5',
    actionColor: '#E16123', // Orange
    bgColorPrimary: '#314C90', // Blue
    bgColorSecondary: '#5F9FDA', // Light blue
    bgColorTertiary: '#EDF3FF', // Light purple
};

export default function GroupedTransactionsTable({ transactions }: { transactions?: ITransaction[] }) {
    const [groupedTransactions, setGroupedTransactions] = useState<any[]>(transactions || []);

    useEffect(() => {
        const fetchGroupedTransactions = async () => {
            try {
                const response = await fetch('/api/get-transactions');
                const data = await response.json();

                if (response.ok) {
                    setGroupedTransactions(data.data);
                } else {
                    console.error('Error:', data.error);
                }
            } catch (error) {
                console.error('Error fetching grouped transactions:', error);
            }
        };

        fetchGroupedTransactions();
    }, [transactions]);

    return (
        <TableContainer component={Paper} sx={{ marginTop: 3, borderRadius: 2, boxShadow: 3 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow sx={{ backgroundColor: ColorPalette.bgColorTertiary }}>
                        <TableCell sx={{ width: '5%' }} />
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Account Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Card Number</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Total Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {groupedTransactions.map((account) => (
                        <AccountRow key={account.accountName} account={account} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function AccountRow({ account }: { account: any }) {
    const [open, setOpen] = useState(true);

    return (
        <>
            <TableRow sx={{ backgroundColor: ColorPalette.bgColorSecondary }}>
                <TableCell sx={{ width: '5%' }}>
                    <IconButton aria-label="expand account" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', width: '30%' }}>
                    {account.accountName}
                </TableCell>
                <TableCell sx={{ width: '30%' }} />
                <TableCell sx={{ width: '30%' }} />
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            {account.cards.map((card: any, index: number) => (
                                <CardRow key={index} card={card} />
                            ))}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

function CardRow({ card }: { card: any }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ backgroundColor: ColorPalette.white }}>
                <TableCell sx={{ width: '5%', paddingLeft: 4 }}>
                    <IconButton aria-label="expand card" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ width: '30%' }} />
                <TableCell sx={{ width: '30%' }}>{card.cardNumber}</TableCell>
                <TableCell sx={{ width: '30%', color: card.totalAmount > 0 ? ColorPalette.green : ColorPalette.red }}>
                    ${card.totalAmount.toFixed(2)} {card.totalAmount < 0 && <Warning />}
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, backgroundColor: ColorPalette.white, borderRadius: 1, padding: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Transactions
                            </Typography>
                            <Table size="small" aria-label="transactions">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: ColorPalette.bgColorTertiary }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Transaction Type</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {card.transactions.map((txn: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{txn.description}</TableCell>
                                            <TableCell sx={{ color: txn.transactionAmount > 0 ? ColorPalette.green : ColorPalette.red }}>
                                                ${txn.transactionAmount?.toFixed(2)}
                                            </TableCell>
                                            <TableCell>{txn.transactionType}</TableCell>
                                            <TableCell sx={{ color: txn.isValid ? ColorPalette.green : ColorPalette.red }}>
                                                {txn.isValid ? 'Success' : 'Failed'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
