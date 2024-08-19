"use client";

import { createPage } from "@/actions/actions.pages";
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
import { pagesSchema } from "@/schemas/pages-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CornerDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FolderWithChildren } from "../folders/CreateFolderForm";

export default function CreatePageForm({
  folders,
  userId,
  organizationId,
}: {
  folders: FolderWithChildren[];
  userId: any;
  organizationId: string;
}) {
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const createPageForm = useForm<z.infer<typeof pagesSchema>>({
    resolver: zodResolver(pagesSchema),
    defaultValues: {
      name: "",
      folderId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof pagesSchema>) => {
    startTransition(() => {
      try {
        createPage(data, userId, organizationId).then((res) => {
          if (res?.error) {
            console.error("Error creating page:", res.error);
            setDialogOpen(true); // Reopen dialog if there's an error
            return;
          } else {
            console.log("Page created successfully:", res?.page);
            setDialogOpen(false);

            push(
              `/dashboard/folders/${res.folderHandle}/page/${res?.page?.handle}`
            );
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
          New Page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new Page</DialogTitle>
          <DialogDescription>
            Create a new page to start storing credentials.
          </DialogDescription>
        </DialogHeader>
        <Form {...createPageForm}>
          <form
            id="create-folder-form"
            onSubmit={createPageForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={createPageForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Page name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createPageForm.control}
              name="folderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder</FormLabel>
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
                      {folders.map((folder) => (
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
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a folder to put the page in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="block z-20" type="submit">
              {isPending ? "Creating Page..." : "Create Page"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
