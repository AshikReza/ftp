import { z } from 'zod';

export const CircleCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string().optional(),
  parentId: z.number().nullable().optional(),
  subCategory: z.array(z.object({
    id: z.number(),
    name: z.string(),
    type: z.string().optional(),
    parentId: z.number().nullable().optional(),
  })).optional().default([]),
});

export const CirclePostSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  type: z.string(),
  image: z.string().nullable().optional(),
  imageSm: z.string().nullable().optional(),
  name: z.string().optional(),
  quality: z.string().nullable().optional(),
  year: z.union([z.string(), z.number()]).nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  categories: z.array(z.object({
    id: z.number(),
    name: z.string(),
    parentId: z.number().nullable().optional(),
  })).optional().default([]),
});

export const CirclePostDetailSchema = CirclePostSummarySchema.extend({
  cover: z.string().nullable().optional(),
  metaData: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  view: z.number().nullable().optional(),
  content: z.union([
    z.string(),
    z.array(z.any())
  ]).optional().nullable(),
});

export type CircleCategory = z.infer<typeof CircleCategorySchema>;
export type CirclePostSummary = z.infer<typeof CirclePostSummarySchema>;
export type CirclePostDetail = z.infer<typeof CirclePostDetailSchema>;

