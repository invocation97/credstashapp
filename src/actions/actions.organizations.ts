"use server";
import db from "@/lib/db";

export const getOrganizationById = async (id: string) => {
  try {
    const organization = await db.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    return organization;
  } catch (error) {
    console.error("Error getting organization:", error);
  }
};

export const getOrganizationNameById = async (id: string) => {
  try {
    const organization = await db.organization.findUnique({
      where: { id },
      select: { name: true },
    });

    return organization?.name;
  } catch (error) {
    console.error("Error getting organization name:", error);
  }
};

export const getOrganizationInfo = async (id: string) => {
  try {
    const organization = await db.organization.findUnique({
      where: { id },
    });

    const owner = await db.user.findUnique({
      where: { id: organization?.ownerId },
    });

    const org = {
      ...organization,
      owner: {
        email: owner?.email,
        name: owner?.name,
      },
    };

    return org;
  } catch (error) {
    console.error("Error getting organization info:", error);
  }
};

export const verifyUserOrganizationMembership = async (
  userId: string,
  organizationId: string
) => {
  try {
    const membership = await db.organization.findFirst({
      where: {
        id: organizationId,
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: { id: true },
    });

    return !!membership; // returns true if the user is a member, false otherwise
  } catch (error) {
    console.error("Error verifying user organization membership:", error);
    return false;
  }
};
