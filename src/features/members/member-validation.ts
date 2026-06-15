import { z } from "zod";

export const memberIdSchema = z.string().min(1, "Member ID is required.");

export const optionalReasonSchema = z.string().trim().optional();
