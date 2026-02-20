import { z } from "zod";

const optionalTrimmedString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined))
  .pipe(z.url().optional());

const baseRegisterSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(40),
  lastName: z.string().trim().min(1, "Last name is required.").max(40),
  email: z.email().transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number"),
  profilePhotoUrl: optionalUrl,
  jobTitle: optionalTrimmedString(80),
  bio: optionalTrimmedString(500),
  locationCity: z.string().trim().min(1, "City is required.").max(64),
  locationState: z.string().trim().min(1, "Province/State is required.").max(64),
  phone: optionalTrimmedString(30),
});

const consumerRegisterSchema = baseRegisterSchema.extend({
  role: z.literal("CONSUMER"),
});

const professionalRegisterSchema = baseRegisterSchema
  .extend({
    role: z.literal("PROFESSIONAL"),
    professional: z.object({
      affiliationType: z.enum(["FIRM", "INDEPENDENT"]),
      firmName: optionalTrimmedString(120),
      firmAddress: optionalTrimmedString(180),
      firmWebsite: optionalUrl,
      yearsAtCurrentFirm: z.number().int().min(0).max(80).optional(),
      totalExperienceYears: z.number().int().min(0).max(80),
      licenseNumber: z.string().trim().min(1, "License number is required.").max(80),
      licensingBody: z.string().trim().min(1, "Licensing body is required.").max(120),
      licenseJurisdiction: z.string().trim().min(1, "License jurisdiction is required.").max(120),
      profession: z.string().trim().min(1, "Profession is required.").max(80),
      specializations: z.array(z.string().trim().min(1)).min(1, "Select at least one specialization."),
      pricingModel: z.string().trim().min(1, "Pricing model is required.").max(50),
      pricingDetails: optionalTrimmedString(240),
      hourlyRate: z.number().int().min(0).max(100000).optional(),
      minRate: z.number().int().min(0).max(100000).optional(),
      maxRate: z.number().int().min(0).max(100000).optional(),
      acceptsNewClients: z.boolean(),
      offersInPerson: z.boolean(),
      offersRemote: z.boolean(),
      education: optionalTrimmedString(500),
      certifications: optionalTrimmedString(500),
      professionalBio: optionalTrimmedString(1200),
    }),
  })
  .superRefine((value, ctx) => {
    const professional = value.professional;

    if (professional.affiliationType === "FIRM") {
      if (!professional.firmName) {
        ctx.addIssue({
          code: "custom",
          path: ["professional", "firmName"],
          message: "Firm name is required when affiliated with a firm.",
        });
      }

      if (typeof professional.yearsAtCurrentFirm !== "number") {
        ctx.addIssue({
          code: "custom",
          path: ["professional", "yearsAtCurrentFirm"],
          message: "Years at current firm is required when affiliated with a firm.",
        });
      }
    }

    if (!professional.offersInPerson && !professional.offersRemote) {
      ctx.addIssue({
        code: "custom",
        path: ["professional", "offersRemote"],
        message: "Select at least one service mode (in-person or remote).",
      });
    }

    if (
      typeof professional.minRate === "number" &&
      typeof professional.maxRate === "number" &&
      professional.minRate > professional.maxRate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["professional", "maxRate"],
        message: "Max rate must be greater than or equal to min rate.",
      });
    }
  });

export const registerSchema = z.discriminatedUnion("role", [
  consumerRegisterSchema,
  professionalRegisterSchema,
]);

export const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(8),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
