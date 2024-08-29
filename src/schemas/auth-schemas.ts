import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .min(1)
    .max(255),
});

export const signUpSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .min(1)
    .max(255),
  name: z.string().min(1).max(255),
  token: z.string({ message: "Token is required" }),
});
