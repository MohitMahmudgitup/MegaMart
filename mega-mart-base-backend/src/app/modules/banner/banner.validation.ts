
import { z } from 'zod';


export const createBannerSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  image: z.string().optional(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),
  discount: z.number(),
  isActive: z.boolean().optional().default(true),
});


export const updateBannerSchema = createBannerSchema.partial();