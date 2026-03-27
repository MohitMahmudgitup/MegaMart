import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { subCategoryServices } from "./subCategory.service";
import httpStatus from "http-status";

const getAllsubCategory = catchAsync(async (req, res) => {
  const result = await subCategoryServices.getAllSubCategoryFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Sub Categories retrieve successfully!",
    data: result,
  });
});

const getSinglesubCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await subCategoryServices.getSingleSubCategoryFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieve successfully!",
    data: result,
  });
});


const createsubCategory = catchAsync(async (req, res) => {
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  }
  const subCategoryData = {
    ...req.body,
    image: files["image"]?.[0]?.path || '',
    bannerImg: files["bannerImg"]?.[0]?.path || ''
  }

  
  const result = await subCategoryServices.createsubCategoryIntoDB(subCategoryData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category created successfully!",
    data: result,
  });
});

export const subCategoryControllers = {
  getAllsubCategory,
  getSinglesubCategory,
  createsubCategory,
};

