import { z } from 'zod';

export const createBannerSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  image: z.string().optional(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),
  discount: z.preprocess((val) => (val !== undefined && val !== "" ? Number(val) : undefined), z.number().optional()),
  isActive: z.preprocess((val) => val === "true" || val === true, z.boolean()).optional().default(true),
});

export const updateBannerSchema = createBannerSchema.partial();