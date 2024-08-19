import { getPageId } from "@/actions/actions.pages";
import { auth } from "@/auth";
import EditorTemplate from "@/components/editor/EditorTemplate";

export default async function PagePage({
  params,
}: {
  params: { folderHandle: string; pageHandle: string };
}) {
  const { pageHandle, folderHandle } = params;

  const session = await auth();

  if (!session) {
    return null;
  }

  const user = session?.user;

  if (!user || !user.organizationId) {
    return null;
  }

  const pageId = await getPageId(pageHandle, user.organizationId);

  if (!pageId) {
    return null;
  }

  return (
    <div>
      <EditorTemplate
        name={pageHandle}
        organizationId={user.organizationId}
        userId={user.id}
        folderHandle={folderHandle}
        pageHandle={pageHandle}
        pageId={pageId}
      />
    </div>
  );
}
