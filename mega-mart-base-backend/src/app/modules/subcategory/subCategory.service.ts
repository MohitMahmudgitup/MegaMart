import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { TSubCategory } from "./TSubCategory.interface";
import { subCategoryModel } from "./subcategory.model";
import httpStatus from "http-status";

const getAllSubCategoryFromDB = async () => {
  const result = await subCategoryModel.find();
  return result;
};

const getSingleSubCategoryFromDB = async (id: string) => {
  const result = await subCategoryModel.findById(id)
  return result;
};


const createsubCategoryIntoDB = async (payload: TSubCategory) => {
  const isCategoryExists = await subCategoryModel.findOne({ name: payload?.name });

  //creating slug
  payload.slug = payload.name.split(" ").join("-").toLowerCase();

   if (payload.isFeatured === true) {
     const featuredCount = await subCategoryModel.countDocuments({
       isFeatured: true,
     });

     if (featuredCount >= 4) {
       payload.isFeatured = false;

       throw new AppError(
         400,
         'Maximum 4 featured categories allowed! This category has been set to non-featured.'
       );
     }
   }

  if (isCategoryExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Category with ${isCategoryExists?.name} is already exists!`
    );
  }
  const result = await subCategoryModel.create(payload);
  return result;
};

export const subCategoryServices = {
  getAllSubCategoryFromDB,
  getSingleSubCategoryFromDB,
createsubCategoryIntoDB
};