import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { orderServices } from "./order.service";

const getAllOrder = catchAsync(async (req, res) => {
  const result = await orderServices.getAllOrdersFromDB(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieve successfully!",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const customerId = req.params.id;

  const { data, meta } = await orderServices.getMyOrdersFromDB(
    customerId,
    req.query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully!",
    data: data,
    meta: meta,
  });
});

// ─── Guest Orders ────────────────────────────────────────────
const getGuestOrders = catchAsync(async (req, res) => {
  const { orderIds } = req.body;

  if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "No order IDs provided",
      data: [],
    });
  }

  const result = await orderServices.getGuestOrdersFromDB(orderIds);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Guest orders retrieved successfully!",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await orderServices.getSingleOrderFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieve successfully!",
    data: result,
  });
});

const createOrder = catchAsync(async (req, res) => {
  try {
    const orderData = req.body;


    const result = await orderServices.createOrderIntoDB(orderData);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Order created successfully!",
      data: result,
    });
  } catch (error: any) {
    console.error("CREATE ORDER ERROR:", error);

    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: error.message || "Order failed",
      data: null,
    });
  }
});

const cancelOrder = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await orderServices.cancelOrderIntoDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order canceld successfully!",
    data: result,
  });
});

const updateStats = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await orderServices.updateStatsIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Status Updated successfully!",
    data: result,
  });
});

const updatetrackingLink = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await orderServices.updatetrackingLinkIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order trackingLink set successfully!",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const id = req.params.id;
  await orderServices.deleteOrderFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order deleted successfully!",
    data: [],
  });
});

export const orderControllers = {
  getAllOrder,
  getSingleOrder,
  createOrder,
  getMyOrders,
  getGuestOrders,
  cancelOrder,
  updateStats,
  updatetrackingLink,
  deleteOrder,
};