import { auth } from "@/auth";
import AddUsersToOrganization from "@/components/forms/onboarding/AddUsersToOrganization";
import React from "react";

export default async function OrganizationPageSettings() {
  const session = await auth();
  if (!session) {
    return null;
  }
  const organizationId = session.user.organizationId;

  if (!organizationId) {
    return null;
  }
  return (
    <div>
      <AddUsersToOrganization organizationId={organizationId} step="adding" />
    </div>
  );
}
