import QueryBuilder from "../../builder/QueryBuilder";
import { TShipping } from "./shipping.interface";
import { ShippingModel } from "./shipping.model";

const createShippingOnDB = async (payload: TShipping) => {
  const result = await ShippingModel.create(payload);
  return result;
};


const updateShippingOnDB = async (payload: TShipping, id: string) => {

  const isExist = await ShippingModel.findById(id);

  if (!isExist) {
    throw new Error('Shipping data not found!');
  }


  const result = await ShippingModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteShippingOnDB = async (id: string) => {

  const isExist = await ShippingModel.findById(id);

  if (!isExist) {
    throw new Error('Shipping data not found!');
  }
  const result = await ShippingModel.findByIdAndDelete(id);

  return result;
};



const getAllShippingFromDB = async (query: Record<string, unknown>) => {
   
  const shippingQuery = new QueryBuilder(ShippingModel.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await shippingQuery.modelQuery;
  return result;
};

const getSingleShippingFromDB = async (id: string) => {
  const result = await ShippingModel.findById(id);
  return result;
};


const shippingStats = async () => {
  const stats = await ShippingModel.aggregate([
    {
      $group: {
        _id: "$name",
        totalUsage: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        types: { $addToSet: "$type" },
        globalCount: {
          $sum: { $cond: [{ $eq: ["$global", "1"] }, 1, 0] },
        },
      },
    },
    {
      $group: {
        _id: null,
        carriers: { $sum: 1 }, // কতগুলো আলাদা carrier আছে
        shippingMethods: { $sum: "$totalUsage" }, // মোট method count
        revenue: { $sum: "$totalAmount" }, // সব amount এর যোগফল
        details: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        shippingMethods: 1,
        carriers: 1,
        avgDeliveryTime: { $literal: 2.4 }, // আপাতত static
        revenue: 1,
        details: 1,
      },
    },
  ]);

  return stats[0] || {};
};



export const shippingServices = {
  createShippingOnDB,
  getAllShippingFromDB,
  getSingleShippingFromDB,
  updateShippingOnDB,
  deleteShippingOnDB,
  shippingStats,
};
