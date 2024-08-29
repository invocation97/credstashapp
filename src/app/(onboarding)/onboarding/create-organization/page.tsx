import {
  addUserToOrganization,
  getOrganizationById,
} from "@/actions/actions.organizations";
import { auth } from "@/auth";
import LinkWithArrow from "@/components/common/LinkWithArrow";
import CreateOrganizationForm from "@/components/forms/onboarding/CreateOrganizationForm";
import { redirect } from "next/navigation";

export default async function CreateOrganizationPage({
  searchParams,
}: {
  searchParams: { organizationId: string };
}) {
  const { organizationId } = searchParams;
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = session?.user;

  if (!user) {
    redirect("/auth/sign-in");
  }

  const organization = await getOrganizationById(user.organizationId as string);

  await addUserToOrganization(user.id, organizationId);

  const joinedOrganization = organization?.id === organizationId;

  const organizationName = organization?.name;

  return (
    <>
      {!user.organizationId ? (
        <CreateOrganizationForm user={user!} />
      ) : (
        <div className="relative max-w-md text-center">
          Congratulations on {joinedOrganization ? "joining" : "creating"}{" "}
          {organizationName}!
          {joinedOrganization ? (
            <LinkWithArrow href="/dashboard">
              {`Let's get started`}
            </LinkWithArrow>
          ) : (
            <LinkWithArrow href="/onboarding/add-users">
              {`Let's add some users`}
            </LinkWithArrow>
          )}
        </div>
      )}
    </>
  );
}
