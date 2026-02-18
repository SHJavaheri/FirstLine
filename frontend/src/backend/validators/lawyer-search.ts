import { z } from "zod";

const toOptionalNumber = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  });

export const lawyerSearchSchema = z.object({
  q: z.string().trim().optional(),
  specialization: z.string().trim().optional(),
  location: z.string().trim().optional(),
  minRate: toOptionalNumber,
  maxRate: toOptionalNumber,
  minRating: toOptionalNumber,
});
