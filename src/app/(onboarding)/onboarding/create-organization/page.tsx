import { getOrganizationById } from "@/actions/actions.organizations";
import { auth } from "@/auth";
import CreateOrganizationForm from "@/components/forms/onboarding/CreateOrganizationForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
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
          <Link
            className={cn(buttonVariants({ variant: "link" }), "underline")}
            href="/onboarding/add-users"
          >
            Add members to your organization
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}
    </>
  );
}
