import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { settingServices } from './settings.service';

const getSetting = catchAsync(async (req, res) => {
  const result = await settingServices.getSettingIntoDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Settings Recived successfully!',
    data: result,
  });
});

const updateSetting = catchAsync(async (req, res) => {
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const payload = {
    ...req.body,
  };

  if (files['siteLogo']) {
    payload.siteLogo = files['siteLogo']?.[0]?.path || '';
  }

   if (files['appInfoBanner']) {
     payload.appInfoBanner = files['appInfoBanner']?.[0]?.path || '';
   }
   if (files['discountBanner']) { 
     payload.discountBanner = files['discountBanner']?.[0]?.path || '';
   }


  const result = await settingServices.updateSettingIntoDB(
    req.params.id,
    payload
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Settings Recived successfully!',
    data: result,
  });
});

export const settingControllers = {
  getSetting,
  updateSetting,
};
