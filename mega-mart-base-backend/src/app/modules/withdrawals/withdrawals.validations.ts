import { z } from 'zod';
import { PaymentMethod, PaymentStatus } from './withdrawals.interface';

export const createWithdrawalZodSchema = z.object({
  vendorId: z.string({
    message: 'Vendor ID is required and must be a string',
  }),

  amount: z
    .number({
      message: 'Amount is required and must be a number',
    })
    .min(1, 'Amount must be greater than 0'),

  paymentMethod: z.enum(
    Object.values(PaymentMethod) as [PaymentMethod, ...PaymentMethod[]],
    {
      message: `Payment method must be one of: ${Object.values(
        PaymentMethod
      ).join(' | ')}`,
    }
  ),


  number: z.string().optional(),

  visa: z
    .object({
      cardNumber: z.number({
        message: 'Card number is required and must be a number',
      }),
      cardName: z.string({
        message: 'Card name is required and must be a string',
      }),
    })
    .optional(),
});
