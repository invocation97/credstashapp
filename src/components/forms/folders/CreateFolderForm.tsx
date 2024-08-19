"use client";

import { createFolder } from "@/actions/actions.folders";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { folderSchema } from "@/schemas/folder-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder } from "@prisma/client";
import { CornerDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface FolderWithChildren extends Folder {
  children?: FolderWithChildren[];
}

export default function CreateFolderForm({
  userId,
  organizationId,
  availableFolders,
}: {
  userId: any;
  organizationId: string;
  availableFolders: FolderWithChildren[];
}) {
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const createFolderForm = useForm<z.infer<typeof folderSchema>>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      parentFolderId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof folderSchema>) => {
    setDialogOpen(false);
    startTransition(() => {
      try {
        const res = createFolder(data, userId, organizationId).then((res) => {
          if (res?.error) {
            console.error("Error creating folder:", res.error);
            setDialogOpen(true); // Reopen dialog if there's an error
            return;
          } else {
            console.log("Folder created successfully:", res.folder);
            setDialogOpen(false);
            push(`/dashboard/folders/${res?.folder?.handle}`);
          }
        });
      } catch (error) {
        console.error("Error during folder creation:", error);
        setDialogOpen(true); // Reopen dialog if there's an error
      }
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="w-full">
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your pages.
          </DialogDescription>
        </DialogHeader>
        <Form {...createFolderForm}>
          <form
            id="create-folder-form"
            onSubmit={createFolderForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={createFolderForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Folder name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createFolderForm.control}
              name="parentFolderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Folder</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a folder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableFolders.map(
                        (folder) => (
                          console.log("folder", folder),
                          (
                            <React.Fragment key={folder.id}>
                              <SelectGroup>
                                <SelectItem value={folder.id}>
                                  {folder.name}
                                </SelectItem>
                                {folder.children &&
                                  folder.children.map((child) => (
                                    <div
                                      key={child.id}
                                      className="flex items-center flex-row pl-8"
                                    >
                                      <CornerDownRight className="size-4" />
                                      <SelectItem value={child.id}>
                                        {child.name}
                                      </SelectItem>
                                      {child.children &&
                                        child.children.map((grandchild) => (
                                          <SelectItem
                                            key={grandchild.id}
                                            value={grandchild.id}
                                          >
                                            {grandchild.name}
                                          </SelectItem>
                                        ))}
                                    </div>
                                  ))}
                              </SelectGroup>
                              <Separator className="w-full" />
                            </React.Fragment>
                          )
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a parent folder to nest this folder under.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="block z-20" type="submit">
              {isPending ? "Creating Folder..." : "Create Folder"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
