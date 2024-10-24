import mongoose, { Schema } from 'mongoose';

export interface ITransaction {
  accountName: string;
  cardNumber: number;
  transactionAmount: number;
  transactionType: 'Credit' | 'Debit' | 'Transfer';
  description: string;
  targetCardNumber?: number;
  isProcessed: boolean;
  isValid: boolean;
}

const transactionSchema = new Schema<ITransaction>({
  accountName: { type: String, },
  cardNumber: { type: Number, },
  transactionAmount: { type: Number, },
  transactionType: { type: String, enum: ['Credit', 'Debit', 'Transfer'], },
  description: { type: String },
  targetCardNumber: { type: Number },
  isProcessed: { type: Boolean, default: false },
  isValid: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);
