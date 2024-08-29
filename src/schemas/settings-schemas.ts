import z from "zod";

export const generalSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  darkMode: z.boolean(),
});

export const accountSettingsSchema = z.object({
  name: z.string(),
});
