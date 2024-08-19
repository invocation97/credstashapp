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

const emailSchema = z
  .string({
    message: "Email must be a string",
  })
  .email({ message: "Email is invalid" });

export const addUsersToOrganizationSchema = z.object({
  emails: z
    .string({
      message: "Emails must be a string",
    })
    .refine((val) => {
      const emails = val.split(",").map((email) => email.trim());
      return emails.every((email) => emailSchema.safeParse(email).success);
    }, "Invalid email format")
    .transform((val) => val.split(",").map((email) => email.trim())),
});

export const finalizeOnboardingSchema = z.object({
  finalize: z.string(),
});
