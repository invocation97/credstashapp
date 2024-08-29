"use server";

import db from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
  }
};

export const createRole = async (name: string) => {
  try {
    const roleExists = await db.role.findFirst({
      where: { name },
    });

    if (roleExists) {
      return roleExists;
    }
    const newRole = await db.role.create({
      data: {
        name,
      },
    });
    return newRole;
  } catch (error) {
    console.error("Error creating role:", error);
  }
};
