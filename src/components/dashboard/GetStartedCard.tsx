import { Folder } from "@prisma/client";
import CreateFolderForm from "../forms/folders/CreateFolderForm";
import CreatePageForm from "../forms/pages/CreatePageForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function GetStartedCard({
  userId,
  organizationId,
  folders,
}: {
  userId: any;
  organizationId: string;
  folders: Folder[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <p>
            Welcome to your dashboard! Get started by creating a new folder or
            page.
          </p>
          <div className="flex gap-2">
            <CreateFolderForm
              userId={userId}
              organizationId={organizationId}
              availableFolders={folders}
            />
            <CreatePageForm
              userId={userId}
              organizationId={organizationId}
              folders={folders}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
