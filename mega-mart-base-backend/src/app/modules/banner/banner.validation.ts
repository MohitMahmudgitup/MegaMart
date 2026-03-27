
import { z } from 'zod';


export const createBannerSchema = z.object({
  title: z.string().min(1, 'title is required'),
  subTitle: z.string().min(1, 'subTitle is required'),
  image: z.string().url('image must be a valid URL').optional(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),
  discount: z.number(),
  isActive: z.boolean().optional().default(true),
});


export const updateBannerSchema = createBannerSchema.partial();