import { getOrganizationById } from "@/actions/actions.organizations";
import { auth } from "@/auth";
import LinkWithArrow from "@/components/common/LinkWithArrow";
import CreateOrganizationForm from "@/components/forms/onboarding/CreateOrganizationForm";
import { redirect } from "next/navigation";

export default async function CreateOrganizationPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = session?.user;

  if (!user) {
    redirect("/auth/sign-in");
  }

  let organization = {
    id: "",
    name: "",
  };

  if (user.organizationId) {
    /* @ts-ignore */
    organization = await getOrganizationById(user.organizationId as string);
  }

  const organizationName = organization?.name;

  return (
    <>
      {!user.organizationId ? (
        <CreateOrganizationForm user={user!} />
      ) : (
        <div className="relative max-w-md text-center">
          Congratulations on creating {organizationName}!
          <LinkWithArrow href="/onboarding/add-users">
            {`Let's add some users`}
          </LinkWithArrow>
        </div>
      )}
    </>
  );
}
