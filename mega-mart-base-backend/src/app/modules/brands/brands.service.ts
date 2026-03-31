import AppError from '../../errors/handleAppError';
import { TBrands } from './brands.interface';
import { BrandModel } from './brands.model';
import httpStatus from 'http-status';



const getAllBrandsFromDB = async () => {
  const result = await BrandModel.find();
  return result;
  
};

const getSingleBrandFromDB = async (id: string) => {
  const result = await BrandModel.findById(id);

  return result;
};

const createBrandOnDB = async (payload: Partial<TBrands>) => {
  const isBrandExists = await BrandModel.findOne({ name: payload?.name });

  if (isBrandExists) {
    throw new AppError(httpStatus.CONFLICT, 'Brand Already Exists!');
  }

  const result = await BrandModel.create(payload);

  return result;
};

export const updateBrandOnDB = async (
  id: string,
  payload: Partial<TBrands>
) => {
  
  const isBrandExists = await BrandModel.findById(id);

  if (!isBrandExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Brand not found!');
  }

  const updatedBrand = await BrandModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedBrand;
};
export const DeleteBrandOnDB = async (id: string) => {
  const isBrandExists = await BrandModel.findById(id);

  if (!isBrandExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Brand not found!');
  }

  const updatedBrand = await BrandModel.findByIdAndDelete(id);

  return updatedBrand;
};

const getProductsByBrand = async () => {
    const result = await BrandModel.find({}, { "images.image": 1, _id: 0 });
  return result;
}

export const brandServices = {
  getAllBrandsFromDB,
  getSingleBrandFromDB,
  createBrandOnDB,
  updateBrandOnDB,
  DeleteBrandOnDB,
  getProductsByBrand
};
