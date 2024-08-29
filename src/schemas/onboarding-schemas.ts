import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string({
      message: "Organization name must be a string",
    })
    .min(1, { message: "Organization name is required" })
    .max(30, { message: "Organization name is too long" })
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "Organization name must be alphanumeric",
    }),
});

const emailSchema = z.string().email({ message: "Invalid email address" });

export const addUsersToOrganizationSchema = z.object({
  emails: z.array(z.string().email()),
});

export const finalizeOnboardingSchema = z.object({
  finalize: z.string(),
});
