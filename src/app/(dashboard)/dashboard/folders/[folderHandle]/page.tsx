import {
  getFolderId,
  getFoldersForOrganization,
} from "@/actions/actions.folders";
import { getFolderByHandle, getPagesForFolder } from "@/actions/actions.pages";
import { auth } from "@/auth";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import CreatePageForm from "@/components/forms/pages/CreatePageForm";
import PagesPreviewTable from "@/components/pages/PagesPreviewTable";
import PagesPreviewTableSearch from "@/components/pages/PagesPreviewTableSearch";
import { createNameFromHandle } from "@/lib/utils";
import { Page } from "@prisma/client";
import { Suspense } from "react";

export interface ExtendedPageInfo extends Page {
  createdBy?: { name?: string };
  editedBy?: { name?: string };
  folderHandle?: string;
}

export default async function FolderPage({
  params,
  searchParams,
}: {
  params: { folderHandle: string };
  searchParams: { q: string };
}) {
  const { q } = searchParams;
  const { folderHandle } = params;

  const lowercaseHandle = folderHandle.toLowerCase();
  const session = await auth();

  const user = session?.user;

  const folderId = await getFolderId(lowercaseHandle, user?.organizationId!);

  if (!folderId) {
    return null;
  }

  const folder = await getFolderByHandle(lowercaseHandle, folderId);

  if (!user || !user.organizationId || !folder) {
    return null;
  }
  const folders = await getFoldersForOrganization(user?.organizationId!);

  if (!folders) {
    return null;
  }

  const pages = await getPagesForFolder(folder.id, user?.organizationId);

  if (!pages) {
    return null;
  }
  const folderName = createNameFromHandle(folderHandle);

  const breadcrumbs = [
    { name: "Dashboard", href: "/dashboard" },
    { name: folderName, href: `/dashboard/folders/${folderHandle}` },
  ];

  return (
    <div className="py-6">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Folder Name</h1>
        <div className="flex items-center space-x-4">
          <PagesPreviewTableSearch q={q} />
          <CreatePageForm
            userId={user.id}
            organizationId={user.organizationId}
            folders={folders!}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Suspense fallback={"loading..."}>
          <PagesPreviewTable
            folderHandle={folderHandle}
            pages={pages as ExtendedPageInfo[]}
            q={q}
            organizationId={user.organizationId}
          />
        </Suspense>
      </div>
    </div>
  );
}
