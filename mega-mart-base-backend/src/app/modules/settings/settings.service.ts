import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/handleAppError";
import { TSiteSettings } from "./settings.interface";
import { SiteSettingsModel } from "./settings.model";

const getSettingIntoDB = async () => {
  const result = await SiteSettingsModel.find()
  return result;
};


export const updateSettingIntoDB = async (
  id: string,
  payload: Partial<TSiteSettings>
) => {
  const existingSetting = await SiteSettingsModel.findById(id);
  if (!existingSetting) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Settings not found!');
  }

  const updatedSetting = await SiteSettingsModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  return updatedSetting;
};

export const settingServices = {
  getSettingIntoDB,
  updateSettingIntoDB,
};
