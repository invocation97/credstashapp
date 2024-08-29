import { auth } from "@/auth";
import LinkWithArrow from "@/components/common/LinkWithArrow";
import AddUsersToOrganization from "@/components/forms/onboarding/AddUsersToOrganization";
import { redirect } from "next/navigation";
import React from "react";

export default async function AddUsersPage({
  searchParams,
}: {
  searchParams: {
    step: "adding" | "added";
  };
}) {
  const { step } = searchParams;
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
      <AddUsersToOrganization
        organizationId={user.organizationId}
        step={step}
      />
      {step === "added" && (
        <div className="mt-4 text-center">
          <LinkWithArrow href="/onboarding/finalize">
            Proceed to Finalize Onboarding
          </LinkWithArrow>
        </div>
      )}
    </div>
  );
}
