import { Schema, model, Types, Document } from 'mongoose';
import { PaymentMethod, PaymentStatus, TVisa, TWithdrawals } from './withdrawals.interface';



const VisaSchema = new Schema<TVisa>({
  cardNumber: { type: Number, required: true },
  cardName: { type: String, required: true },
}, {
  _id: false,
});

const WithdrawalsSchema = new Schema<TWithdrawals>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'vendor', required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
    },
    number: { type: String },
    visa: { type: VisaSchema },
    payment: { type: Schema.Types.ObjectId, ref: 'payment' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Model
const WithdrawalsModel = model<TWithdrawals>('Withdrawal', WithdrawalsSchema);

export default WithdrawalsModel;
