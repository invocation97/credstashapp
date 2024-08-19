"use client";

import { getPageContent, savePageContent } from "@/actions/actions.pages";
import { createNameFromHandle } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import { Editor } from "./Editor";
import PageHeader from "./PageHeader";

export default function EditorTemplate({
  name,
  organizationId,
  userId,
  folderHandle,
  pageHandle,
  pageId,
}: {
  name: string;
  organizationId: string;
  userId: string;
  folderHandle: string;
  pageHandle: string;
  pageId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(""); // State to store the content
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  // Fetch the initial content on component mount
  useEffect(() => {
    const fetchContent = async () => {
      const result = await getPageContent(name, pageId, organizationId);
      if (result.success && result.content) {
        setValue(result.content);
      }
      setIsLoading(false);
    };

    fetchContent();
  }, [name, pageId, organizationId]);

  // Handle saving the content
  const onSave = async () => {
    startTransition(() => {
      savePageContent(name, pageId, value, organizationId, userId)
        .then((response) => {
          if (response.success) {
            console.log("Content saved successfully");
          } else {
            console.error("Failed to save content:", response.error);
          }
        })
        .catch((error) => console.error("Error during save:", error));
    });
  };

  const nameFromHandle = createNameFromHandle(name);

  const placeholderText = `Start entering content for ${nameFromHandle}.`;

  if (isLoading) {
    return <div>Loading editor...</div>;
  }

  return (
    <div>
      <PageHeader
        pageName={nameFromHandle}
        onSave={onSave}
        isPending={isPending}
        folderHandle={folderHandle}
        pageHandle={pageHandle}
      />
      <Editor
        value={value}
        onChange={setValue}
        placeholder={placeholderText}
        name={name}
      />
    </div>
  );
}
