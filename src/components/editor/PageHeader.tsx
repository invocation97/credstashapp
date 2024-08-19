"use client";
import { useMemo } from "react";
import Breadcrumbs from "../common/Breadcrumbs";
import EditorActions from "./EditorActions";
import { createNameFromHandle } from "@/lib/utils";

interface PageHeaderProps {
  pageName: string;
  onSave: () => void;
  isPending: boolean;
  folderHandle: string;
  pageHandle: string;
}

export default function PageHeader({
  pageName,
  onSave,
  isPending,
  folderHandle,
  pageHandle,
}: PageHeaderProps) {
  const folderName = createNameFromHandle(folderHandle);

  const breadcrumbs = useMemo(
    () => [
      { name: "Dashboard", href: "/dashboard" },
      { name: folderName, href: `/dashboard/folders/${folderHandle}` },
      {
        name: pageName,
        href: `/dashboard/folders/${folderHandle}/${pageHandle}`,
      },
    ],
    [folderHandle, pageHandle, folderName, pageName]
  );
  return (
    <div className="overflow-auto flex-1 py-6">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold capitalize">{pageName}</h2>
        <EditorActions onSave={onSave} isPending={isPending} />
      </div>
    </div>
  );
}
