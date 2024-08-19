import { MountainIcon, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import UserDropdown from "./UserDropdown";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PageActions from "./PageActions";
import { getFoldersForOrganization } from "@/actions/actions.folders";

export default async function DashboardHeader() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = session?.user;

  if (!user || !user.organizationId) {
    return null;
  }

  const folders = await getFoldersForOrganization(user.organizationId!);

  if (!folders) {
    return null;
  }

  return (
    <header className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">{process.env.APP_NAME}</span>
        </Link>
        <div className="relative max-w-xl w-full md:ml-10">
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md bg-muted pl-8 pr-4 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <UserDropdown user={user} />
          <PageActions user={user} folders={folders} />
        </div>
      </div>
    </header>
  );
}
