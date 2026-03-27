import { Schema, model } from 'mongoose';
import { TSiteSettings } from './settings.interface';

const siteSettingsSchema = new Schema<TSiteSettings>(
  {
    siteName: { type: String },
    siteLogo: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    contactAddress: { type: String },
    about: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
      tiktok: { type: String },
    },
    discountBanner: { type: String },
    appInfoBanner: { type: String },
  },
  {
    timestamps: true,
  }
);

export const SiteSettingsModel = model<TSiteSettings>(
  'SiteSettings',
  siteSettingsSchema
);
