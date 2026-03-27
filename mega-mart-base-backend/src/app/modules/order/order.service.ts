import AppError from '../../errors/handleAppError';
import httpStatus from 'http-status';
import { OrderModel } from './order.model';
import { OrderSearchableFields } from './order.consts';
import { TOrder } from './order.interface';
import { nanoid } from 'nanoid';
import { QueryBuilder } from '../../utils/QueryBuilder';

const getAllOrdersFromDB = async (query: Record<string, string>) => {
  const attributeQuery = new QueryBuilder(OrderModel.find(), query)

  const SearchableFields = ['_id'];
  const allAttributes = attributeQuery
    .search(['_id'])
    .filter()
    .sort()
    .paginate();

  allAttributes.modelQuery = allAttributes.modelQuery.populate([
    {
      path: 'orderInfo.productInfo',
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

  const result = { data, meta };

  return result;
};

const getMyOrdersFromDB = async (
  customerId: string,
  query: Record<string, string>
) => {
  
  const ordersQuery = new QueryBuilder(OrderModel.find({ 'orderInfo.orderBy': customerId })
    .populate( 'paymentId', 'orderId customerId transactionId status amount createdAt updatedAt' )
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

export const orderServices = {
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  createOrderIntoDB,
  getMyOrdersFromDB,
  cancelOrderIntoDB,
  updateStatsIntoDB,
  updatetrackingLinkIntoDB,
};
