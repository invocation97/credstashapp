"use client";

import { ExtendedPageInfo } from "@/app/(dashboard)/dashboard/folders/[folderHandle]/page";
import { formatDate } from "@/lib/utils";
import { FilePenIcon, ShareIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import DeletePageForm from "../forms/pages/DeletePageForm";
import { Button, buttonVariants } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function PagesPreviewTable({
  pages,
  q,
  folderHandle,
  organizationId,
}: {
  pages: ExtendedPageInfo[];
  q: string;
  folderHandle: string;
  organizationId: string;
}) {
  console.log("pages", pages);
  const [sort, setSort] = useState({ key: "name", order: "asc" });

  const params = useSearchParams();

  const query = params.get("q");

  const handleSort = (key: string) => {
    if (sort.key === key) {
      setSort({ key, order: sort.order === "asc" ? "desc" : "asc" });
    } else {
      setSort({ key, order: "asc" });
    }
  };

  const sortedPages = useMemo(() => {
    const filteredPages = pages.filter((page) => {
      if (query) {
        return page.name.toLowerCase().includes(q);
      } else {
        return page;
      }
    });
    return filteredPages.sort((a, b) => {
      if (sort.key === "name") {
        return sort.order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sort.key === "createdAt") {
        return sort.order === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sort.key === "updatedAt") {
        return sort.order === "asc"
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });
  }, [pages, query, q, sort]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer"
            onClick={() => handleSort("name")}
          >
            Page Name
            {sort.key === "name" && (
              <span className="ml-1">
                {sort.order === "asc" ? "\u2191" : "\u2193"}
              </span>
            )}
          </TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => handleSort("lastEditedBy")}
          >
            Last Edited By
            {sort.key === "lastEditedBy" && (
              <span className="ml-1">
                {sort.order === "asc" ? "\u2191" : "\u2193"}
              </span>
            )}
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedPages.map((page, index) => {
          console.log("page", page);
          return (
            <TableRow key={index} className="cursor-pointer">
              <TableCell className="font-medium">
                <Link
                  href={`/dashboard/folders/${folderHandle.toLowerCase()}/page/${page.handle}`}
                  className={buttonVariants({ variant: "link", size: "sm" })}
                >
                  {page.name}
                </Link>
              </TableCell>
              <TableCell>{formatDate(page.createdAt)}</TableCell>
              <TableCell>{formatDate(page.updatedAt)}</TableCell>
              <TableCell>
                {page.createdBy ? page.createdBy.name : "\\"}
              </TableCell>
              <TableCell>
                {page?.editedBy?.name ? page.editedBy.name : "\\"}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <FilePenIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <DeletePageForm
                    pageId={page.id}
                    pageHandle={page.handle}
                    buttonContent={<TrashIcon className="size-4" />}
                    organizationId={organizationId}
                  />
                  <Button variant="ghost" size="icon">
                    <ShareIcon className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
