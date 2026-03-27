import { optional, z } from "zod";

export const iconSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "Icon name is required!" : "Not a string!",
  }),
});

export const imageItemSchema = z.object({
  layout: z
    .enum(["grid", "slider"])
    .refine((val) => ["grid", "slider"].includes(val), {
      message: "View type must be either 'grid' or 'slider'",
    }),
  image: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Image is required!" : "Not a string!",
    })
    .url("Invalid image URL!"),
});

export const createBrandZodSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "Brand name is required!" : "Not a string!",
  }),
  icon: iconSchema,
});





export const updateimageItemSchema = z.object({
  layout: z
    .enum(['grid', 'slider'])
    .refine(val => ['grid', 'slider'].includes(val), {
      message: "View type must be either 'grid' or 'slider'",
    }).optional(),
  image: z
    .string()
    .url('Invalid image URL!').optional(),
});



export const updateiconSchema = z.object({
  name: z.string().optional(),
  url: z
    .string()
    .url('Invalid icon URL!').optional(),
});

export const updateBrandZodSchema = z.object({
  name: z.string().optional(),
  icon: updateiconSchema.optional(),
  images: updateimageItemSchema.optional(),
});