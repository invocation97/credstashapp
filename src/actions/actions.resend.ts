"use server";

import { Resend } from "resend";
import { getOrganizationNameById } from "./actions.organizations";
import InviteUsersToOrganizationTemplate from "@/components/email-templates/InviteUsersToOrganization";
import { addUsersToOrganizationSchema } from "@/schemas/onboarding-schemas";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrganizationInvite = async (
  values: z.infer<typeof addUsersToOrganizationSchema>,
  organizationId: string
) => {
  const validatedData = addUsersToOrganizationSchema.safeParse(values);

  if (!validatedData.success) {
    return {
      success: false,
      error: validatedData.error.errors.map((err) => err.message).join(", "),
    };
  }

  const { emails } = validatedData.data;
  const invites = [];

  console.log("Validated Emails: ", emails);

  try {
    const organizationName = await getOrganizationNameById(organizationId);

    if (!organizationName) {
      return {
        success: false,
        error: "Organization not found",
      };
    }

    for (const email of emails) {
      // Check if the user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(
          `User with email ${email} already exists. Skipping invite.`
        );
        continue;
      }

      // Check if the user has a pending invitation
      const existingInvitation = await db.invite.findFirst({
        where: {
          email,
          organizationId,
        },
      });

      if (existingInvitation) {
        console.log(
          `Pending invitation for ${email} already exists. Skipping invite.`
        );
        continue;
      }

      const token = uuidv4();
      console.log("Token: ", token);
      console.log("Email: ", email);
      console.log("Organization ID: ", organizationId);

      await db.invite.create({
        data: {
          email,
          organizationId,
          token,
        },
      });

      const acceptInvitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-up?token=${token}`;

      const result = await resend.emails.send({
        from: `${process.env.APP_NAME} <${process.env.RESEND_EMAIL_SENDER}>`,
        to: email,
        subject: `You have been invited to join ${organizationName}`,
        react: InviteUsersToOrganizationTemplate({
          organizationName,
          acceptInvitationUrl,
        }),
      });

      invites.push({ success: true, data: result });
    }

    return { success: true, invites };
  } catch (error) {
    console.error("Error sending invitation emails:", error);

    let errorMessage = "An error occurred while sending invitations.";
    if (error instanceof Error) {
      errorMessage += ` ${error.message}`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};
