"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const withdrawals_model_1 = __importDefault(require("../withdrawals/withdrawals.model"));
const sslCommerz_service_1 = require("./sslCommerz/sslCommerz.service");
const invoice_1 = require("../../utils/invoice");
const order_model_1 = require("../order/order.model");
const order_interface_1 = require("../order/order.interface");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const Payout = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const transactionId = getTransactionId();
    const session = yield payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const OrderDetails = yield order_model_1.OrderModel.findById(orderId);
        if (!OrderDetails) {
            throw new handleAppError_1.default(http_status_codes_1.default.NOT_FOUND, 'OrderDetails Not Found');
        }
        const createdPayment = yield payment_model_1.Payment.create([
            {
                orderId: OrderDetails._id,
                customerId: (_a = OrderDetails.orderInfo[0]) === null || _a === void 0 ? void 0 : _a.orderBy,
                transactionId: transactionId,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                amount: OrderDetails.totalAmount,
            },
        ], { session });
        yield order_model_1.OrderModel.findByIdAndUpdate(OrderDetails._id, { payment: createdPayment[0]._id }, { new: true, runValidators: true, session })
            .populate('paymentId')
            .select('-isDeleted');
        const userAddress = 'Bangladesh';
        const userEmail = (OrderDetails === null || OrderDetails === void 0 ? void 0 : OrderDetails.customerInfo.email) || 'unknown@gmail.com';
        const userPhoneNumber = OrderDetails === null || OrderDetails === void 0 ? void 0 : OrderDetails.customerInfo.phone;
        const userName = (OrderDetails === null || OrderDetails === void 0 ? void 0 : OrderDetails.customerInfo.firstName) + (OrderDetails === null || OrderDetails === void 0 ? void 0 : OrderDetails.customerInfo.lastName);
        const sslPayload = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            name: userName,
            amount: (_b = createdPayment[0]) === null || _b === void 0 ? void 0 : _b.amount,
            transactionId: (_c = createdPayment[0]) === null || _c === void 0 ? void 0 : _c.transactionId,
        };
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        yield session.commitTransaction();
        session.endSession();
        return sslPayment.GatewayPageURL;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield withdrawals_model_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.PAID,
        }, { new: true, runValidators: true, session: session });
        if (!updatedPayment) {
            throw new handleAppError_1.default(401, 'Payment not found');
        }
        const updateOrder = yield order_model_1.OrderModel.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.orderId, { paymentStatus: order_interface_1.OrderPaymentStatus.PAID, paymentId: updatedPayment._id }, { new: true, runValidators: true, session });
        if (!updateOrder) {
            throw new handleAppError_1.default(401, 'Withdraw not found');
        }
        const invoiceData = {
            transactionId: updatedPayment.transactionId,
            OrderDate: updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.createdAt,
            customerName: (updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.customerInfo.firstName) +
                (updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.customerInfo.lastName),
            customerEmail: updateOrder === null || updateOrder === void 0 ? void 0 : updateOrder.customerInfo.email,
            paymentMethod: 'sslCommerz',
            totalAmount: updatedPayment.amount,
            status: order_interface_1.OrderPaymentStatus.PAID,
            approvedBy: 'Admin',
        };
        const pdfBuffer = yield (0, invoice_1.generatePdf)(invoiceData);
        const cloudinaryResult = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, 'invoice');
        if (!cloudinaryResult) {
            throw new handleAppError_1.default(401, 'Error uploading pdf');
        }
        yield payment_model_1.Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: cloudinaryResult.secure_url }, { runValidators: true, session });
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
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: 'Payment Completed Successfully' };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield withdrawals_model_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.FAILED }, { new: true, runValidators: true, session });
        if (!updatedPayment) {
            throw new Error('Payment not found');
        }
        yield order_model_1.OrderModel.findByIdAndUpdate(updatedPayment.orderId, { status: order_interface_1.OrderPaymentStatus.REJECTED }, { new: true, runValidators: true, session });
        yield session.commitTransaction();
        yield session.endSession();
        return { success: false, message: 'Payment Failed' };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield withdrawals_model_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.CANCELLED,
        }, { runValidators: true, session: session });
        yield order_model_1.OrderModel.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.orderId, { paymentStatus: order_interface_1.OrderPaymentStatus.CANCELLED }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: 'Payment Cancelled' };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.PaymentService = {
    Payout,
    successPayment,
    failPayment,
    cancelPayment,
};
