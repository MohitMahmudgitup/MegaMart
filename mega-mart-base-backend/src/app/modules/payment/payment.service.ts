/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { PAYMENT_STATUS } from './payment.interface';
import { Payment } from './payment.model';
import { uploadBufferToCloudinary } from '../../config/cloudinary.config';
import AppError from '../../errors/handleAppError';
import WithdrawalsModel from '../withdrawals/withdrawals.model';
import { VendorModel } from '../vendor/vendor.model';
import { UserModel } from '../user/user.model';
import { ISSLCommerz } from './sslCommerz/sslCommerz.interface';
import { SSLService } from './sslCommerz/sslCommerz.service';
import { PaymentStatus } from '../withdrawals/withdrawals.interface';
import { sendEmail } from '../../utils/sendEmail';
import { TUser } from '../user/user.interface';
import { generatePdf, IInvoiceData } from '../../utils/invoice';
import { OrderModel } from '../order/order.model';
import { OrderPaymentStatus } from '../order/order.interface';
const getTransactionId: any = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const Payout = async (orderId: string) => {
  const transactionId = getTransactionId();

  const session = await Payment.startSession();
  session.startTransaction();

  try {
    const OrderDetails = await OrderModel.findById(orderId)

    if (!OrderDetails) {
      throw new AppError(httpStatus.NOT_FOUND, 'OrderDetails Not Found');
    }

    const createdPayment = await Payment.create(
      [
        {
          orderId: OrderDetails._id,
          customerId: OrderDetails.orderInfo[0]?.orderBy,
          transactionId: transactionId,
          status: PAYMENT_STATUS.UNPAID,
          amount: OrderDetails.payableAmount,
        },
      ],
      { session }
    );

    await OrderModel.findByIdAndUpdate(
      OrderDetails._id,
      { payment: createdPayment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate('paymentId')
      .select('-isDeleted');

    const userAddress = 'Bangladesh';
    const userEmail = OrderDetails?.customerInfo.email || 'unknown@gmail.com'
    const userPhoneNumber = OrderDetails?.customerInfo.phone
    const userName =  OrderDetails?.customerInfo.firstName + OrderDetails?.customerInfo.lastName

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      name: userName,
      amount: createdPayment[0]?.amount,
      transactionId: createdPayment[0]?.transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    await session.commitTransaction();
    session.endSession();
    return sslPayment.GatewayPageURL;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


const retryPayment = async (paymentId: string) => {
  const session = await Payment.startSession();
  session.startTransaction();

  try {
    // Find the existing payment record
    const existingPayment = await Payment.findById(paymentId)

    if (!existingPayment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found');
    }

    // Check if payment is already successful
    if (existingPayment.status === PAYMENT_STATUS.PAID) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Payment already completed. Cannot retry.'
      );
    }

    // Get the order details
    const orderDetails = await OrderModel.findById(existingPayment.orderId)

    if (!orderDetails) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Generate a new transaction ID for retry
    const newTransactionId = getTransactionId();

    // Update the payment record with new transaction ID and reset status
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        transactionId: newTransactionId,
        status: PAYMENT_STATUS.UNPAID,
      },
      { new: true, session }
    );

    if (!updatedPayment) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update payment record'
      );
    }

    // Update order payment status to UNPAID for retry
    await OrderModel.findByIdAndUpdate(
      orderDetails._id,
      { paymentStatus: OrderPaymentStatus.UNPAID },
      { new: true, session }
    );

    // Prepare SSL Commerz payload
    const userAddress = 'Bangladesh';
    const userEmail = orderDetails?.customerInfo.email || 'unknown@gmail.com';
    const userPhoneNumber = orderDetails?.customerInfo.phone;
    const userName =
      orderDetails?.customerInfo.firstName +
      ' ' +
      orderDetails?.customerInfo.lastName;

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      name: userName,
      amount: updatedPayment.amount,
      transactionId: updatedPayment.transactionId,
    };

    // Initialize SSL Commerz payment
    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    await session.commitTransaction();
    session.endSession();

    return sslPayment.GatewayPageURL;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


const successPayment = async (query: Record<string, string>) => {

  const session = await WithdrawalsModel.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { new: true, runValidators: true, session: session }
    );

    if (!updatedPayment) {
      throw new AppError(401, 'Payment not found');
    }
    const updateOrder = await OrderModel.findByIdAndUpdate(
      updatedPayment?.orderId,
      { paymentStatus: OrderPaymentStatus.PAID, paymentId: updatedPayment._id },
      { new: true, runValidators: true, session }
    );

    if (!updateOrder) {
      throw new AppError(401, 'Withdraw not found');
    }

    const invoiceData: IInvoiceData = {
      transactionId: updatedPayment.transactionId,
      OrderDate: updateOrder?.createdAt,
      customerName:
        updateOrder?.customerInfo.firstName +
        updateOrder?.customerInfo.lastName,
      customerEmail: updateOrder?.customerInfo.email,
      paymentMethod: 'sslCommerz',
      totalAmount: updatedPayment.amount,
      status: OrderPaymentStatus.PAID,
      approvedBy: 'Admin',
    };

    const pdfBuffer = await generatePdf(invoiceData);

    const cloudinaryResult = await uploadBufferToCloudinary(
      pdfBuffer,
      'invoice'
    );

    if (!cloudinaryResult) {
      throw new AppError(401, 'Error uploading pdf');
    }

    await Payment.findByIdAndUpdate(
      updatedPayment._id,
      { invoiceUrl: cloudinaryResult.secure_url },
      { runValidators: true, session }
    );
    // // (vendor?.userId as unknown as TUser).email
    // await sendEmail({
    //   to: 'ibrahimsarkar.dev@gmail.com',
    //   subject: 'Your Payment Invoice',
    //   templateName: 'invoice',
    //   templateData: invoiceData,
    //   attachments: [
    //     {
    //       filename: 'invoice.pdf',
    //       content: pdfBuffer,
    //       contentType: 'application/pdf',
    //     },
    //   ],
    // });

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: 'Payment Completed Successfully' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await WithdrawalsModel.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );

    if (!updatedPayment) {
      throw new Error('Payment not found');
    }

    await OrderModel.findByIdAndUpdate(
      updatedPayment.orderId,
      {  paymentStatus: OrderPaymentStatus.UNPAID , paymentId: updatedPayment._id },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    await session.endSession();

    return { success: false, message: 'Payment Failed' };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};


const cancelPayment = async (query: Record<string, string>) => {
  const session = await WithdrawalsModel.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { runValidators: true, session: session }
    );

    await OrderModel.findByIdAndUpdate(
      updatedPayment?.orderId,
      { paymentStatus: OrderPaymentStatus.CANCELLED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: 'Payment Cancelled' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  Payout,
  successPayment,
  failPayment,
  cancelPayment,
  retryPayment
};
