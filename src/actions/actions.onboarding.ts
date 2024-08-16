"use server";
import db from "@/lib/db";
import {
  addUsersToOrganizationSchema,
  createOrganizationSchema,
} from "@/schemas/onboarding-schemas";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createOrganization = async (name: string, user: User) => {
  // Validate the input
  const validation = createOrganizationSchema.safeParse({ name });
  if (!validation.success) {
    return { message: validation.error.errors[0].message, success: false };
  }

  try {
    // Check if the organization name already exists
    const existingOrganization = await db.organization.findUnique({
      where: { name: validation.data.name },
    });

    if (existingOrganization) {
      return { message: "Organization name already exists", success: false };
    }

    // Create the organization
    const organization = await db.organization.create({
      data: {
        name: validation.data.name,
        ownerId: user.id,
      },
    });

    let adminRole = await prisma?.role.findUnique({
      where: { name: "admin" },
    });

    if (!adminRole) {
      adminRole = await prisma?.role.create({
        data: { name: "admin" },
      });
    }

    const updateUser = await db.user.update({
      where: { id: user.id },
      data: {
        organizationId: organization.id,
        roleId: adminRole?.id,
      },
    });

    revalidatePath("/onboarding/create-organization");

    return {
      message: "Organization created successfully",
      success: true,
      organization,
    };
  } catch (error) {
    console.error("Error creating organization:", error);
    return {
      message: "An error occurred while creating the organization",
      success: false,
    };
  }
};

export const addUsersToOrganization = async (
  data: z.infer<typeof addUsersToOrganizationSchema>,
  organizationId: string
) => {
  const { emails } = data;

  console.log("Emails before validation: ", emails);

  const validatedEmails = [];

  for (const email of emails) {
    const validation = addUsersToOrganizationSchema.safeParse({ email });
    if (!validation.success) {
      return { message: validation.error.errors[0].message, success: false };
    }
    validatedEmails.push(email);
  }

  console.log("Emails after validation: ", validatedEmails);

  try {
    const users = await db.user.findMany({
      where: { email: { in: validatedEmails } },
    });

    console.log("Users found: ", users);

    const existingUsers = users.filter(
      (user) => user.organizationId === organizationId
    );

    if (existingUsers.length > 0) {
      console.log("Existing users: ", existingUsers);

      const existingUsersEmails = existingUsers.map((user) => user.email);
      return {
        message: `${existingUsersEmails.join(" | ")} already part of this organization`,
        success: false,
      };
    }

    await db.user.updateMany({
      where: { email: { in: validatedEmails } },
      data: { organizationId },
    });

    revalidatePath("/onboarding/add-users");

    console.log("Users added successfully");

    return {
      message: "Users added successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error adding users to organization:", error);
    return {
      message: "An error occurred while adding users to the organization",
      success: false,
    };
  }
};
