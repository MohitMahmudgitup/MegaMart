"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWithdrawalZodSchema = void 0;
const zod_1 = require("zod");
const withdrawals_interface_1 = require("./withdrawals.interface");
exports.createWithdrawalZodSchema = zod_1.z.object({
    vendorId: zod_1.z.string({
        message: 'Vendor ID is required and must be a string',
    }),
    amount: zod_1.z
        .number({
        message: 'Amount is required and must be a number',
    })
        .min(1, 'Amount must be greater than 0'),
    paymentMethod: zod_1.z.enum(Object.values(withdrawals_interface_1.PaymentMethod), {
        message: `Payment method must be one of: ${Object.values(withdrawals_interface_1.PaymentMethod).join(' | ')}`,
    }),
    number: zod_1.z.string().optional(),
    visa: zod_1.z
        .object({
        cardNumber: zod_1.z.number({
            message: 'Card number is required and must be a number',
        }),
        cardName: zod_1.z.string({
            message: 'Card name is required and must be a string',
        }),
    })
        .optional(),
});
