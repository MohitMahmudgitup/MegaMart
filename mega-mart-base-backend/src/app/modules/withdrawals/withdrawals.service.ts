import { UserModel } from "../user/user.model";
import { TWithdrawals } from "./withdrawals.interface";
import WithdrawalsModel from "./withdrawals.model";

const createWithdrawalOnDB = async (payload: TWithdrawals) => {

  if (!payload.vendorId) {
    throw new Error('Vendor ID is required');
  }

  const result = await WithdrawalsModel.create(payload);
  return result;
};

const getWithdrawalsFromDB = async () => {
  const result = await WithdrawalsModel.find({ isDeleted: { $ne: true } })
    .populate('vendorId')
    .sort({ createdAt: -1 });

  return result;
};

const getSingleWithdrawalFromDB = async (id: string) => {
  const result = await WithdrawalsModel.findById(id).populate('vendorId');
  return result;
};

const getVendorsWithdrawalFromDB = async (id: string) => {
  const result = await WithdrawalsModel.find({
    vendorId: id,
    isDeleted: { $ne: true },
  }).sort({
    createdAt: -1,
  });
  return result;
};
const updateWithdrawalOnDB = async (
  id: string,
  payload: Partial<TWithdrawals>
) => {

  const result = await WithdrawalsModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteWithdrawalFromDB = async (id: string) => {
  if (!id) throw new Error('ID is required');

  const result = await WithdrawalsModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

export const withdrawalServices = {
  createWithdrawalOnDB,
  getWithdrawalsFromDB,
  getSingleWithdrawalFromDB,
  updateWithdrawalOnDB,
  deleteWithdrawalFromDB,
  getVendorsWithdrawalFromDB,
};
