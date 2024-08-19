import { getFoldersForOrganization } from "@/actions/actions.folders";
import { getPagesForFolder } from "@/actions/actions.pages";
import { auth } from "@/auth";
import path from "path";
import FileTreeItem from "../folders/FileTreeItem";

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

  // Fetch pages for each folder and ensure all promises are resolved
  const foldersWithPages = await Promise.all(
    folders.map(async (folder) => {
      const folderPages = await getPagesForFolder(
        folder.id,
        user.organizationId!
      );
      return {
        name: folder.name,
        path: path.join("/dashboard/folders", folder.handle),
        nodes: folderPages?.map((page) => ({
          name: page.name,
          path: path.join(
            `/dashboard/folders/${folder.handle}/page/${page.handle}`
          ),
        })),
      };
    })
  );

  const sortedFolders = foldersWithPages.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const nodes = folders.map((folder) => ({
    name: folder.name,
    path: path.join("/dashboard/folders", folder.handle),
    nodes: folder.children?.map((childFolder) => ({
      name: childFolder.name,
      path: path.join("/dashboard/folders", childFolder.handle),
      nodes: childFolder.pages?.map((page) => ({
        name: page.name,
        path: path.join(
          `/dashboard/folders/${childFolder.handle}/page/${page.handle}`
        ),
      })),
    })),
  }));

  return (
    <div className="relative hidden h-screen flex-none border-r z-10 pt-20 md:block w-72">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="font-semibold mb-2">Folders</div>
          <ul>
            {nodes.map((node) => (
              <FileTreeItem node={node} key={node.name} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
