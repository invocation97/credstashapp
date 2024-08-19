"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CreateFolderForm from "../forms/folders/CreateFolderForm";
import CreatePageForm from "../forms/pages/CreatePageForm";
import { Folder } from "@prisma/client";

export default function PageActions({
  user,
  folders,
}: {
  user: any;
  folders: Folder[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="ml-4">
          <PlusIcon className="h-4 w-4" />
          <span className="sr-only">Add new</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Add new</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CreateFolderForm
            userId={user.id}
            organizationId={user.organizationId}
            availableFolders={folders}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreatePageForm
            userId={user.id}
            organizationId={user.organizationId}
            folders={folders}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
