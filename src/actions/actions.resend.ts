"use server";

import { Resend } from "resend";
import { getOrganizationNameById } from "./actions.organizations";
import InviteUsersToOrganizationTemplate from "@/components/email-templates/InviteUsersToOrganization";
import { addUsersToOrganizationSchema } from "@/schemas/onboarding-schemas";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrganizationInvite = async (
  values: z.infer<typeof addUsersToOrganizationSchema>,
  organizationId: string
) => {
  const { emails } = values;

  console.log("Emails before validation: ", emails);

  try {
    const organizationName = (await getOrganizationNameById(
      organizationId
    )) as string;

    const acceptInvitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-up?organizationId=${organizationId}`;
    const result = await resend.emails.send({
      from: `${process.env.APP_NAME} <${process.env.RESEND_EMAIL_SENDER}>`,
      to: emails,
      subject: "You have been invited to join an organization",
      react: InviteUsersToOrganizationTemplate({
        organizationName,
        acceptInvitationUrl,
      }),
    });

    console.log("Result: ", result);

    // Return a plain object instead of Response.json()
    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error sending invitation emails:", error);
    return {
      success: false,
      error: "An error occurred while sending invitations.",
    };
  }
};
