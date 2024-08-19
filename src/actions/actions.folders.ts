"use server";

import db from "@/lib/db";
import { createHandleFromName } from "@/lib/utils";
import { folderSchema } from "@/schemas/folder-schemas";
import { unstable_cache as cache, revalidateTag } from "next/cache";
import { z } from "zod";
import { verifyUserOrganizationMembership } from "./actions.organizations";

// Abstracted newFolder function
export const newFolder = cache(
  async (
    name: string,
    organizationId: string,
    userId: string,
    isRoot?: boolean,
    parntFolderId?: string
  ) => {
    const handle = createHandleFromName(name);

    const folder = await db.folder.create({
      data: {
        name,
        handle,
        organizationId,
        createdById: userId,
        editedById: userId,
        isRoot: isRoot || false,
        parentId: parntFolderId || null,
      },
    });
    return folder;
  },
  ["folders"]
);

export const createFolder = async (
  data: z.infer<typeof folderSchema>,
  userId: string,
  organizationId: string
) => {
  console.log("Got data:", data);
  // Validate the input data
  const validation = folderSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }

  const { name, parentFolderId } = validation.data;

  console.log("Creating folder with data:", validation.data);

  try {
    // Verify that the user is a member of the organization
    const isMember = await verifyUserOrganizationMembership(
      userId,
      organizationId
    );

    if (!isMember) {
      return {
        success: false,
        error: "User is not a member of the organization.",
      };
    }

    // Create the folder using the abstracted newFolder function
    const folder = await newFolder(
      name,
      organizationId,
      userId,
      false,
      parentFolderId
    );

    // Revalidate the cache tag
    revalidateTag("folders");

    return {
      success: true,
      message: "Folder created successfully.",
      folder,
    };
  } catch (error) {
    console.error("Error creating folder:", error);
    return {
      success: false,
      error: "An error occurred while creating the folder.",
    };
  }
};

export const getFoldersForOrganization = async (organizationId: string) => {
  try {
    const folders = await db.folder.findMany({
      where: {
        organizationId,
        parentId: null,
      },
      include: {
        children: {
          include: {
            children: true,
            pages: true,
          },
        },
        pages: true,
      },
    });

    if (!folders) {
      return;
    }
    return folders;
  } catch (error) {
    console.error("Error getting folders for organization:", error);
  }
};

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await db.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    if (!folder) {
      return;
    }
    return folder;
  } catch (error) {
    console.error("Error getting folder info:", error);
  }
};

export const getFolderId = async (
  folderHandle: string,
  organizationId: string
) => {
  try {
    const folder = await db.folder.findFirst({
      where: {
        handle: folderHandle,
        organizationId,
      },
    });

    if (!folder) {
      return;
    }
    return folder.id;
  } catch (error) {
    console.error("Error getting folder id:", error);
  }
};
