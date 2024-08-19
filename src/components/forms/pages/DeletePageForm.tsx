"use client";

import { deletePage } from "@/actions/actions.pages";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { createNameFromHandle } from "@/lib/utils";
import { deletePageSchema } from "@/schemas/pages-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export default function DeletePageForm({
  pageId,
  pageHandle,
  organizationId,
  buttonContent,
}: {
  pageId: string;
  pageHandle: string;
  organizationId: string;
  buttonContent: string | JSX.Element;
}) {
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const deletePageForm = useForm({
    resolver: zodResolver(deletePageSchema),
    defaultValues: {
      handle: pageHandle,
    },
  });

  const onSubmit = async () => {
    startTransition(() => {
      try {
        deletePage(pageId, pageHandle, organizationId).then((res) => {
          if (res?.error) {
            console.error("Error deleting page:", res.error);
            setDialogOpen(true); // Reopen dialog if there's an error
            return;
          } else {
            console.log("Page deleted successfully:", res?.message);
            setDialogOpen(false);

            push(`/dashboard/`);
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
        <Button
          type="button"
          variant={"ghost"}
          size={"icon"}
          className="w-full"
        >
          {buttonContent || "Delete Page"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove {createNameFromHandle(pageHandle)}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this page? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...deletePageForm}>
          <form
            id="delete-folder-form"
            onSubmit={deletePageForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="flex items-center justify-between w-full">
              <Button className="block z-20" type="submit">
                {isPending ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant={"destructive"}
                type="button"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
