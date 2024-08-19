import { z } from "zod";

export const pagesSchema = z.object({
  name: z.string().min(1, "Page name is required"),
  folderId: z.string().min(1, "Folder ID is required"),
});

export const deletePageSchema = z.object({
  handle: z.string().min(1, "Page handle is required"),
});
