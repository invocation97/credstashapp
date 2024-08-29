"use server";

import { signOut, signIn } from "@/auth";
import { loginSchema, signUpSchema } from "@/schemas/auth-schemas";
import { z } from "zod";
import { addUserToOrganization } from "./actions.organizations";
import db from "@/lib/db";
import { Invite, User } from "@prisma/client";
import { getUserByEmail } from "./actions.user";

export const signUserOut = async () => {
  await signOut({
    redirectTo: "/auth/sign-in",
  });
};

export const handleSignIn = async () => {
  await signIn("google", {
    redirectTo: "/dashboard",
  });
};

export const signInWithEmail = async (
  formData: z.infer<typeof loginSchema>
) => {
  const validatedData = loginSchema.safeParse(formData);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid data",
    };
  }

  const { email } = validatedData.data;

  try {
    const result = await signIn("resend", {
      email: email,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        message: `Sign-in failed: ${result.error}`,
      };
    }

    return {
      success: true,
      message: "Email sent",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: `An error occurred ${error}`,
    };
  }
};

export const createUserWithInvite = async (
  userData: User,
  inviteToken: Invite["token"]
) => {
  const invite = await db.invite.findUnique({
    where: {
      token: inviteToken,
    },
  });

  if (!invite) {
    throw new Error("Invalid invite token");
  }

  const user = await db.user.create({
    data: {
      ...userData,
      organizationId: invite.organizationId,
    },
  });

  await db.invite.update({
    where: {
      token: inviteToken,
    },
    data: {
      status: "accepted",
    },
  });

  return user;
};

export const signUp = async (formData: z.infer<typeof signUpSchema>) => {
  const validatedData = signUpSchema.safeParse(formData);

  if (!validatedData.success) {
    return {
      success: false,
      error: "Invalid data",
    };
  }

  const { email, name, token } = validatedData.data;
  const normalizedEmail = email.toLowerCase();

  try {
    const invite = await db.invite.findUnique({
      where: { token },
      include: { organization: true },
    });

    if (!invite) {
      return {
        success: false,
        error: "Invalid or expired invitation token",
      };
    }

    if (invite.email.toLowerCase() !== normalizedEmail) {
      return {
        success: false,
        error: "Email does not match the invitation",
      };
    }

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      // Check if the user is already a member of the organization
      const existingMembership = await db.user.findFirst({
        where: {
          id: existingUser.id,
          organizationId: invite.organizationId,
        },
      });

      if (!existingMembership) {
        await db.user.update({
          where: { id: existingUser.id },
          data: {
            organizationId: invite.organizationId,
          },
        });
      }
    } else {
      await db.user.create({
        data: {
          email: normalizedEmail,
          name: name,
          didFinishOnboarding: true,
          organizationId: invite.organizationId,
        },
      });
    }

    await db.invite.update({
      where: { token },
      data: {
        status: "accepted",
      },
    });

    // Send magic link for authentication
    await signIn("resend", {
      email: normalizedEmail,
      redirect: false,
    });

    return {
      success: true,
      message: "Magic link sent to your email. Please check your inbox.",
    };
  } catch (error) {
    console.error("Error signing up:", error);
    return {
      success: false,
      error: "An error occurred while processing your request.",
    };
  }
};
