import { getFoldersForOrganization } from "@/actions/actions.folders";
import {
  getOrganizationInfo,
  verifyUserOrganizationMembership,
} from "@/actions/actions.organizations";
import { getPagesForFolder } from "@/actions/actions.pages";
import { auth } from "@/auth";
import GetStartedCard from "@/components/dashboard/GetStartedCard";
import RecentActivityTable from "@/components/dashboard/RecentActivityTable";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import { Folder } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { ExtendedPageInfo } from "./folders/[folderHandle]/page";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const { q } = searchParams;
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = session?.user;
  if (!user) {
    return redirect("/auth/sign-in");
  }

  if (!user.organizationId) {
    return redirect("/onboarding");
  }

  const isMember = await verifyUserOrganizationMembership(
    user.id,
    user.organizationId
  );

  if (!isMember) {
    return notFound();
  }

  const organization = await getOrganizationInfo(user.organizationId);

  if (!organization) {
    return notFound();
  }

  const folders = await getFoldersForOrganization(user.organizationId);

  if (!folders) {
    return null;
  }

  const pages = await Promise.all(
    folders.map(async (folder: Folder) => {
      const pages = await getPagesForFolder(folder.id, user.organizationId!);
      return pages;
    })
  );

  const pagesWithFolderHandles = pages.map((folderPages, index) => {
    if (!folderPages) return [];
    return folderPages.map((page) => {
      return {
        ...page,
        folderHandle: folders[index].handle,
      };
    });
  });

  const latestPages = pagesWithFolderHandles
    .flat()
    .sort((a, b) => {
      if (!a || !b) return 0;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 5);

  if (!folders) {
    return null;
  }

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
      <WelcomeCard user={user} organization={organization} />
      <GetStartedCard
        userId={user.id}
        organizationId={user.organizationId}
        folders={folders}
      />
      <RecentActivityTable
        pages={latestPages as ExtendedPageInfo[]}
        organizationId={user.organizationId}
        className="col-span-2"
      />
    </div>
  );
}
