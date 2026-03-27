import { z } from 'zod';

export const updateSiteSettingsZodSchema = z.object({
  siteName: z.string().optional(),
  siteLogo: z.string().url('Invalid site logo URL!').optional(),
  contactEmail: z.string().email('Invalid email format!').optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  about: z.string().optional(),
  socialLinks: z
    .object({
      facebook: z.string().url('Invalid Facebook URL!').optional(),
      instagram: z.string().url('Invalid Instagram URL!').optional(),
      twitter: z.string().url('Invalid Twitter URL!').optional(),
      linkedin: z.string().url('Invalid LinkedIn URL!').optional(),
      youtube: z.string().url('Invalid YouTube URL!').optional(),
      tiktok: z.string().url('Invalid TikTok URL!').optional(),
    })
    .optional(),
  discountBanner: z.string().url('Invalid discount banner URL!').optional(),
  appInfoBanner: z.string().url('Invalid app info banner URL!').optional(),
});
