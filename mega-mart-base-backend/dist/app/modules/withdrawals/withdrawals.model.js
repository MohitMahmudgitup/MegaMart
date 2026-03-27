"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const withdrawals_interface_1 = require("./withdrawals.interface");
const VisaSchema = new mongoose_1.Schema({
    cardNumber: { type: Number, required: true },
    cardName: { type: String, required: true },
}, {
    _id: false,
});
const WithdrawalsSchema = new mongoose_1.Schema({
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'vendor', required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: Object.values(withdrawals_interface_1.PaymentMethod),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(withdrawals_interface_1.PaymentStatus),
        default: withdrawals_interface_1.PaymentStatus.Pending,
    },
    number: { type: String },
    visa: { type: VisaSchema },
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: 'payment' },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Model
const WithdrawalsModel = (0, mongoose_1.model)('Withdrawal', WithdrawalsSchema);
exports.default = WithdrawalsModel;
