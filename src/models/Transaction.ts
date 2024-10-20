import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
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
  accountName: { type: String, required: true },
  cardNumber: { type: Number, required: true },
  transactionAmount: { type: Number, required: true },
  transactionType: { type: String, enum: ['Credit', 'Debit', 'Transfer'], required: true },
  description: { type: String },
  targetCardNumber: { type: Number },
  isProcessed: { type: Boolean, default: false },
  isValid: { type: Boolean, default: true },
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);
