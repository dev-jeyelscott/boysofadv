import { z } from "zod";

export const idSchema = z.string().trim().min(1);

export const requiredStringSchema = z.string().trim().min(1);

export const optionalStringSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""));

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const optionalUrlSchema = z
  .string()
  .trim()
  .url()
  .optional()
  .or(z.literal(""));
