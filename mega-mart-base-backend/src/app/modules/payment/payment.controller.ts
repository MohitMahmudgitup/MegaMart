import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import config from '../../config';
import { SSLService } from './sslCommerz/sslCommerz.service';
import AppError from '../../errors/handleAppError';



const Payout = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const result = await PaymentService.Payout(orderId as string);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment create successfully',
    data: result,
  });
});

const retryPayment = catchAsync(async (req: Request, res: Response) => {
  const paymentId = req.params.paymentId;
  const result = await PaymentService.retryPayment(paymentId as string);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment create successfully',
    data: result,
  });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.successPayment(
    query as Record<string, string>
  );

  if (result.success) {
    res.redirect(
      `${config.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});
const failPayment = catchAsync(async (req: Request, res: Response) => {
   const query = req.query;
   const result = await PaymentService.failPayment(
     query as Record<string, string>
   );


  if (!result.success) {
    res.redirect(
      `${config.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.cancelPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${config.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  await SSLService.validatepayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment Validated Successfully',
    data: null,
  });
});

export const PaymentController = {
  Payout,
  successPayment,
  failPayment,
  cancelPayment,
  validatePayment,
  retryPayment
};
