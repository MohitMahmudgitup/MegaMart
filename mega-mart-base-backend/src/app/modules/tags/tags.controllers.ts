import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { tagServices } from "./tags.services";

const getAllTags = catchAsync(async (req, res) => {
  const result = await tagServices.getAllTagsFromDB(req.query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tags retrieve successfully!",
    data: result,
  });
});

const getSingleTag = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await tagServices.getSingleTagFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag data retrieve successfully!",
    data: result,
  });
});

const createTag = catchAsync(async (req, res) => {
  const tagData = {
    ...req.body,
    image: req.file?.path
  }
  const result = await tagServices.createTagOnDB(tagData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag created successfully!",
    data: result,
  });
});


const updateTag = catchAsync(async (req, res) => {
  const tagData = {
    ...req.body
  }

  if (req.file?.path) {
    tagData.image = req.file?.path
  }
  const result = await tagServices.updateTagOnDB(req.params.id,tagData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tag updated successfully!',
    data: result,
  });
});


const getStatus = catchAsync(async (req, res) => {
  
  const result = await tagServices.getStatus();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tag updated successfully!',
    data: result,
  });
});

export const tagControllers = {
  getAllTags,
  getSingleTag,
  createTag,
  updateTag,
  getStatus,
};
