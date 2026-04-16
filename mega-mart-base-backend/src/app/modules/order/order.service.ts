import AppError from '../../errors/handleAppError';
import httpStatus from 'http-status';
import { OrderModel } from './order.model';
import { OrderSearchableFields } from './order.consts';
import { TOrder } from './order.interface';
import { nanoid } from 'nanoid';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { Types } from "mongoose";

const getAllOrdersFromDB = async (query: Record<string, string>) => {
  const attributeQuery = new QueryBuilder(OrderModel.find(), query);

  const allAttributes = attributeQuery
    .search(['_id'])
    .filter()
    .sort()
    .paginate();

  allAttributes.modelQuery = allAttributes.modelQuery.populate([
    {
      path: 'orderInfo.productInfo',
      select: '_id featuredImg description.name', // only needed fields
    },
    {
      path: 'orderInfo.shopInfo',
      select: 'shopAddress basicInfo',
    },
    {
      path: 'orderInfo.orderBy',
      select: 'userId',
    },
  ]);

  const [data, meta] = await Promise.all([
    allAttributes.build().exec(),
    attributeQuery.getMeta(),
  ]);

  // 🔥 CLEAN DATA HERE
  const cleanedData = data.map((order) => {
    const orderObj = order.toObject();

    orderObj.orderInfo = orderObj.orderInfo.map((item: any) => {
      if (item.productInfo) {
        item.productInfo = {
          _id: item.productInfo._id,
          name: item.productInfo.description?.name,
          featuredImg: item.productInfo.featuredImg,
        };
      }

      return item;
    });

    return orderObj;
  });

  return {
    data: cleanedData,
    meta,
  };
};

const getMyOrdersFromDB = async (
  customerId: string,
  query: Record<string, string>
) => {

  const ordersQuery = new QueryBuilder(OrderModel.find({ 'orderInfo.orderBy': customerId })
    .populate('paymentId', 'orderId customerId transactionId status amount createdAt updatedAt')
    .populate('orderInfo.productInfo', 'description featuredImg'), query)

  const allCoupons = ordersQuery.search(OrderSearchableFields).filter().sort().paginate();

  const [data, meta] = await Promise.all([
    allCoupons.build().exec(),
    ordersQuery.getMeta()
  ])

  return {
    data, meta
  }
};

const getSingleOrderFromDB = async (id: string) => {
  const result = OrderModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order does not exists!');
  }

  return result;
};

const createOrderIntoDB = async (payload: TOrder) => {
  if (payload) {
    payload.orderInfo.forEach(order => (order.trackingNumber = nanoid()));
  }
  const result = await OrderModel.create(payload);

  return result;
};

const cancelOrderIntoDB = async (id: string) => {

  const isExist = await OrderModel.findById(id);
  if (!isExist) {
    throw new AppError(404, 'Order not found');
  }


  const result = await OrderModel.findByIdAndUpdate(
    id,
    { 'orderInfo.$[].isCancelled': true, 'orderInfo.$[].status': 'cancelled' },
    { new: true, runValidators: true }
  );

  return result;
};


const updateStatsIntoDB = async (id: string, payload: { status: string }) => {
  const isExist = await OrderModel.findById(id);
  if (!isExist) {
    throw new AppError(404, 'Order not found');
  }

  const result = await OrderModel.findByIdAndUpdate(
    id,
    { 'orderInfo.$[].status': payload.status },
    { new: true, runValidators: true }
  );

  return result;
};


const updatetrackingLinkIntoDB = async (
  id: string,
  payload: { trackCode: string }
) => {
  const isExist = await OrderModel.findById(id);
  if (!isExist) {
    throw new AppError(404, 'Order not found');
  }

  const result = await OrderModel.findByIdAndUpdate(
    id,
    { trackingCode: payload.trackCode },
    { new: true, runValidators: true }
  );

  return result;
};

const deleteOrderFromDB = async (id: string) => {
  const isExist = await OrderModel.findById(id);
  if (!isExist) {
    throw new AppError(404, 'Order not found');
  }
  const result = await OrderModel.findByIdAndDelete(id);
  return result;
};


const getGuestOrdersFromDB = async (orderIds: string[]) => {
  const objectIds = orderIds
    .filter(id => Types.ObjectId.isValid(id))
    .map(id => new Types.ObjectId(id));

  if (objectIds.length === 0) return [];

  const orders = await OrderModel.find({
    _id: { $in: objectIds },
  })
    .populate({
      path: "orderInfo.productInfo",
      select: "description featuredImg",
    })
    .populate("paymentId", "orderId customerId transactionId status amount createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  return orders;
};

export const orderServices = {
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  createOrderIntoDB,
  getMyOrdersFromDB,
  cancelOrderIntoDB,
  updateStatsIntoDB,
  updatetrackingLinkIntoDB,
  deleteOrderFromDB,
  getGuestOrdersFromDB
};
