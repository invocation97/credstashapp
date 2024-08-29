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
import { FolderWithChildren } from "@/components/forms/folders/CreateFolderForm";

// Helper function to flatten folders and create a mapping of folderId to folderHandle
const flattenFolders = (folders: any) => {
  const flatMap = new Map<string, string>();
  const traverse = (folderList: any) => {
    folderList.forEach((folder: FolderWithChildren) => {
      flatMap.set(folder.id, folder.handle);
      if (folder.children && folder.children.length > 0) {
        traverse(folder.children);
      }
    });
  };

  traverse(folders);
  return flatMap;
};

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

  // Create a folderId to folderHandle mapping
  const folderMap = flattenFolders(folders);

  // Recursive function to fetch pages for all folders including nested ones
  const fetchPagesRecursively = async (folder: any) => {
    const folderPages = await getPagesForFolder(
      folder.id,
      user.organizationId!
    );
    const childFolders = folder.children || [];

    const nestedPages = await Promise.all(
      childFolders.map(async (childFolder: Folder) => {
        return await fetchPagesRecursively(childFolder);
      })
    );

    return [...folderPages!, ...nestedPages.flat()];
  };

  // Fetch all pages for all folders
  const allPages = await Promise.all(
    folders.map(async (folder) => {
      return await fetchPagesRecursively(folder);
    })
  );

  // Map pages with their respective folder handles using the folderMap
  const pagesWithFolderHandles = allPages.flat().map((page) => {
    return {
      ...page,
      folderHandle: folderMap.get(page.folderId),
    };
  });

  // Sort and filter pages for the "Recent Activity" table
  const latestPages = pagesWithFolderHandles
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

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
