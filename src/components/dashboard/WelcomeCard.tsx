import { getFoldersForOrganization } from "@/actions/actions.folders";
import { getOrganizationInfo } from "@/actions/actions.organizations";
import { getPagesForFolder } from "@/actions/actions.pages";
import { Folder } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default async function WelcomeCard({
  user,
  organization,
}: {
  user: any;
  organization: any;
}) {
  const folders = await getFoldersForOrganization(organization.id);

  if (!folders) {
    return null;
  }

  const folderCount = folders?.length ?? 0;

  const allPages = await Promise.all(
    folders.map(async (folder: Folder) => {
      const pages = await getPagesForFolder(folder.id, user.organizationId);
      return pages;
    })
  );

  const pagesCount = allPages.flat().length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">Welcome, {user.name}!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div>
            <span>
              Recent{" "}
              <span className="custom-gradient font-heading font-bold">
                {organization.name}
              </span>{" "}
              activity
            </span>
          </div>
          <div>
            <span className="font-semibold">Folders:</span> {folderCount}
          </div>
          <div>
            <span className="font-semibold">Pages:</span> {pagesCount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
