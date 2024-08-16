"use server";
import db from "@/lib/db";

export const getOrganizationById = async (id: string) => {
  try {
    const organization = await db.organization.findUnique({
      where: { id },
    });

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
