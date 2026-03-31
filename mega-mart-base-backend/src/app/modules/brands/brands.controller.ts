import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { brandServices } from './brands.service';
import { TBrandIcon, TBrands, TImage } from './brands.interface';
import { createBrandZodSchema } from './brands.validation';
import { BrandModel } from './brands.model';
import { ProductModel } from "../product/product.model";
import mongoose from 'mongoose';

const getAllBrands = catchAsync(async (req, res) => {
  const result = await brandServices.getAllBrandsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brands retrieve successfully!',
    data: result,
  });
});

const getSingleBrand = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await brandServices.getSingleBrandFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand data retrieve successfully!',
    data: result,
  });
});

const createBrand = catchAsync(async (req, res) => {
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const iconDetails = {
      name: req.body.icon?.name,
      url: files['iconImage']?.[0]?.path,
  }
  

  const brandData = {
    ...req.body,
    icon: files['gridImage']?.[0]?.path && {
      name: req.body.icon?.name,
      url: files['iconImage']?.[0]?.path,
    },
    images: [
      files['gridImage']?.[0]?.path && {
        layout: 'grid',
        image: files['gridImage']?.[0]?.path,
      },

      files['sliderImage']?.[0]?.path && {
        layout: 'slider',
        image: files['sliderImage']?.[0]?.path,
      },
    ].filter(Boolean),
  };

  const result = await brandServices.createBrandOnDB(brandData as TBrands);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand created successfully!',
    data: result,
  });
});

const updateBrand = catchAsync(async (req, res) => {
  const brand = await BrandModel.findById(req.params.id);
  if (!brand) throw new Error('Brand not found');
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const updatedBrandData: Partial<TBrands> = { ...req.body };

  // ====== ICON UPDATE ======
  const existingIcon: TBrandIcon = brand.icon || { name: '', url: '' };
  const iconFilePath = files?.['iconImage']?.[0]?.path;

  updatedBrandData.icon = {
    name: req.body.icon?.name || existingIcon.name || '',
    url: iconFilePath || existingIcon.url || '',
  };

  // ====== IMAGE UPDATE ======

  const existingImages: TImage[] = brand.images || [];
  if (files['gridImage']?.[0]?.path) {
    const otherImages = existingImages.filter(img => img.layout !== 'grid');
    otherImages.push({
      layout: 'grid',
      image: files['gridImage'][0].path,
    } as const);
    updatedBrandData.images = otherImages;
  } else {
    updatedBrandData.images = existingImages;
  }

  if (files['sliderImage']?.[0]?.path) {
    const otherImages = updatedBrandData.images.filter(
      img => img.layout !== 'slider'
    );
    otherImages.push({
      layout: 'slider',
      image: files['sliderImage'][0].path,
    } as const);
    updatedBrandData.images = otherImages;
  }

  const result = await brandServices.updateBrandOnDB(
    req.params.id,
    updatedBrandData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand updated successfully!',
    data: result,
  });
});

const deleteBrand = catchAsync(async (req, res) => {
  await brandServices.DeleteBrandOnDB(req.params.id);
  console.log('DELETE brand hit', req.params.id);


  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brand deleted successfully!',
    data: null,
  });
});


const getProductsByBrand = catchAsync(async (req, res) => {
  const brandId = req.params.id;

  const products = await ProductModel.find({
    'brandAndCategories.brand': new mongoose.Types.ObjectId(brandId),
  });


  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Products retrieved successfully!',
    data: products,
  });
});

// ------------------------------ data managemant-------------------------------
const getsliderImage = catchAsync(async (req, res) => {
  const result = await brandServices.getProductsByBrand( );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Brands retrieve successfully!',
    data: result,
  });
})

export const brandsControllers = {
  getAllBrands,
  getSingleBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  getProductsByBrand,
  getsliderImage
};
