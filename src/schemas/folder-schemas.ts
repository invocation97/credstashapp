import { z } from "zod";

export const folderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  parentFolderId: z.string(),
});
