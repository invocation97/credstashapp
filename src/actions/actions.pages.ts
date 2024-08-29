"use server";

import db from "@/lib/db";
import { createHandleFromName } from "@/lib/utils";
import { pagesSchema } from "@/schemas/pages-schemas";
import { unstable_cache as cache, revalidateTag } from "next/cache";
import { z } from "zod";
import { verifyUserOrganizationMembership } from "./actions.organizations";

export const getPagesForFolder = async (
  folderId: string,
  organizationId: string
) => {
  try {
    const pages = await db.page.findMany({
      where: {
        folderId,
        organizationId,
      },
    });

    const createdBys = await db.user.findMany({
      where: {
        id: {
          in: pages.map((page) => page.createdById),
        },
      },
    });

    const editedBys = await db.user.findMany({
      where: {
        id: {
          in: pages.map((page) => page.editedById),
        },
      },
    });

    const fullPagesInfo = pages.map((page) => {
      const createdBy = createdBys.find((user) => user.id === page.createdById);
      const editedBy = editedBys.find((user) => user.id === page.editedById);

      return {
        ...page,
        createdBy,
        editedBy,
      };
    });

    return fullPagesInfo;
  } catch (error) {
    console.error("Error getting pages for folder:", error);
  }
};

export const getFolderByHandle = async (handle: string, id: string) => {
  try {
    const folder = await db.folder.findUnique({
      where: { handle, id },
    });

    return folder;
  } catch (error) {
    console.error("Error getting folder by handle:", error);
  }
};

export const newPage = cache(
  async (
    name: string,
    folderId: string,
    organizationId: string,
    userId: string
  ) => {
    const handle = createHandleFromName(name);

    try {
      const page = await db.page.create({
        data: {
          name,
          handle,
          content: "",
          organizationId,
          folderId,
          createdById: userId,
          editedById: userId,
        },
      });

      return page;
    } catch (error) {
      console.error("Error creating page:", error);
    }
  },
  ["pages"]
);

export const createPage = async (
  data: z.infer<typeof pagesSchema>,
  userId: string,
  organizationId: string
) => {
  try {
    // Validate the input data
    const validation = pagesSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
      };
    }

    console.log("validated data:", validation.data);

    const { name, folderId } = validation.data;

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

    // Create the page using the abstracted newPage function
    const page = await newPage(name, folderId, organizationId, userId);

    // Fetch the folder information
    const folder = await db.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return {
        success: false,
        error: "Folder not found.",
      };
    }

    // Revalidate the cache tag
    revalidateTag("pages");

    return {
      success: true,
      message: "Page created successfully.",
      page,
      folderHandle: folder.handle,
    };
  } catch (error) {
    console.error("Error creating page:", error);
    return {
      success: false,
      error: "Error creating page.",
    };
  }
};

export const savePageContent = async (
  pageHandle: string,
  id: string,
  content: string,
  organizationId: string,
  userId: string
) => {
  try {
    const page = await db.page.findUnique({
      where: {
        id,
        handle: pageHandle,
        organizationId,
      },
    });

    if (!page) {
      return {
        success: false,
        error: "Page not found.",
      };
    }

    const updatedPage = await db.page.update({
      where: { id: page.id },
      data: {
        content,
        editedById: userId,
        updatedAt: new Date(),
      },
    });

    if (!updatedPage) {
      return {
        success: false,
        error: "Failed to update page.",
      };
    }

    revalidateTag("pages");

    return {
      success: true,
      message: "Page content saved successfully.",
    };
  } catch (error) {
    console.error("Error saving page content:", error);
    return {
      success: false,
      error: "Error saving page content.",
    };
  }
};

export const getPageContent = async (
  pageHandle: string,
  id: string,
  organizationId: string
) => {
  try {
    const page = await db.page.findUnique({
      where: { handle: pageHandle, organizationId, id },
    });

    if (!page) {
      return {
        success: false,
        error: "Page not found.",
      };
    }

    return {
      success: true,
      content: page.content,
    };
  } catch (error) {
    console.error("Error getting page content:", error);
    return {
      success: false,
      error: "Error getting page content.",
    };
  }
};

export const deletePage = async (
  id: string,
  pageHandle: string,
  organizationId: string
) => {
  try {
    const page = await db.page.findUnique({
      where: { handle: pageHandle, organizationId, id },
    });

    if (!page) {
      return {
        success: false,
        error: "Page not found.",
      };
    }

    await db.page.delete({ where: { id: page.id } });

    console.log("Page deleted successfully.", pageHandle);

    revalidateTag("pages");

    return {
      success: true,
      message: "Page deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting page:", error);
    return {
      success: false,
      error: "Error deleting page.",
    };
  }
};

export const getPageId = async (pageHandle: string, organizationId: string) => {
  try {
    const page = await db.page.findFirst({
      where: { handle: pageHandle, organizationId },
    });

    if (!page) {
      return null;
    }

    return page.id;
  } catch (error) {
    console.error("Error getting page ID:", error);
    return null;
  }
};
