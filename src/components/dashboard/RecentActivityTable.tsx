"use client";
import { ExtendedPageInfo } from "@/app/(dashboard)/dashboard/folders/[folderHandle]/page";
import { cn } from "@/lib/utils";
import { FilePenIcon, ShareIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import DeletePageForm from "../forms/pages/DeletePageForm";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function RecentActivityTable({
  className,
  pages,
  organizationId,
}: {
  className?: string;
  pages: ExtendedPageInfo[];
  organizationId: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page Name</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Last Edited By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => {
              return (
                <TableRow key={page.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/dashboard/folders/${page.folderHandle!.toLowerCase()}/page/${page.handle}`}
                      className={buttonVariants({
                        variant: "link",
                        size: "sm",
                      })}
                    >
                      {page.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {page.createdBy ? page.createdBy?.name : "Unknown"}
                  </TableCell>
                  <TableCell>
                    {page.editedBy ? page.editedBy?.name : "Unknown"}
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
                      <span className="sr-only">Delete</span>

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
      </CardContent>
    </Card>
  );
}
