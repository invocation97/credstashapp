import { getFoldersForOrganization } from "@/actions/actions.folders";
import { getPagesForFolder } from "@/actions/actions.pages";
import { auth } from "@/auth";
import { Folder } from "@prisma/client";
import { Settings } from "lucide-react";
import path from "path";
import FileTreeItem from "../folders/FileTreeItem";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function DashboardSidebar() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const user = session?.user;

  if (!user || !user.organizationId) {
    return null;
  }

  const folders = await getFoldersForOrganization(user.organizationId);

  if (!folders) {
    return null;
  }

  // Helper function to build the file tree recursively
  async function buildFileTree(folder: any) {
    const folderPages = await getPagesForFolder(
      folder.id,
      user.organizationId!
    );
    const childFolders = folder.children || [];

    const childNodes = await Promise.all(
      childFolders.map((childFolder: Folder[]) => buildFileTree(childFolder))
    );

    return {
      name: folder.name,
      path: path.join("/dashboard/folders", folder.handle),
      nodes: [
        ...folderPages!.map((page) => ({
          name: page.name,
          path: path.join(
            `/dashboard/folders/${folder.handle}/page/${page.handle}`
          ),
        })),
        ...childNodes,
      ],
    };
  }

  const nodes = await Promise.all(folders.map(buildFileTree));

  return (
    <div className="relative hidden h-screen flex-none border-r z-10 pt-20 md:block w-72">
      <div className="flex flex-col items-start gap-4 h-full justify-between py-4">
        <div className="px-3 py-2">
          <div className="font-semibold mb-2">Folders</div>
          <ul>
            {nodes.map((node) => (
              <FileTreeItem node={node} key={node.name} />
            ))}
          </ul>
        </div>
        <div className="px-3 py-2">
          <Link
            href="/dashboard/settings"
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <span>Settings</span>
            <Settings className="size-5 shrink-0 text-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
