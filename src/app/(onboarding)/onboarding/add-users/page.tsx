import { auth } from "@/auth";
import AddUsersToOrganization from "@/components/forms/onboarding/AddUsersToOrganization";
import { redirect } from "next/navigation";
import React from "react";

export default async function AddUsersPage() {
  const session = await auth();

  if (!session) {
    return redirect("/auth/sign-in");
  }

  const user = session?.user;

  if (!user || !user.organizationId) {
    return redirect("/auth/sign-in");
  }

  return (
    <div>
      <AddUsersToOrganization organizationId={user.organizationId} />
    </div>
  );
}
