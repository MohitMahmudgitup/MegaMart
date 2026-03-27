import QueryBuilder from "../../builder/QueryBuilder";
import { VendorSearchableFields } from "./vendor.consts";
import { TVendor } from "./vendor.interface";
import { VendorModel } from "./vendor.model";

const createVendorOnDB = async (payload: TVendor) => {
  const result = await VendorModel.create(payload);
  return result;
};

const getAllVendorFromDB = async (query: Record<string, unknown>) => {
  const vendorQuery = await VendorModel.find().populate("userId")
   
  const result = await vendorQuery
  return result;
};

const getSingleVendorFromDB = async (id: string) => {
  const result = await VendorModel.find({userId: id});
  return result;
};


const getVendorByUserIdFromDB  = async (id: string) => {
  const result = await VendorModel.findOne({ userId: id });
  return result;
};
const updateStatus = async (id : string , status: string) => {
  return VendorModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
}

export const vendorServices = {
  createVendorOnDB,
  getAllVendorFromDB,
  getSingleVendorFromDB,
  getVendorByUserIdFromDB,
  updateStatus,
};
