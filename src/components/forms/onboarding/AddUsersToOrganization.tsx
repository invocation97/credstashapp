"use client";

import { useActionState } from "react";
import { sendOrganizationInvite } from "@/actions/actions.resend";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { addUsersToOrganizationSchema } from "@/schemas/onboarding-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AddUsersToOrganization({
  organizationId,
}: {
  organizationId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const addUsersForm = useForm<z.infer<typeof addUsersToOrganizationSchema>>({
    resolver: zodResolver(addUsersToOrganizationSchema),
    defaultValues: {
      emails: [""],
    },
  });

  const onSubmit = async (
    values: z.infer<typeof addUsersToOrganizationSchema>
  ) => {
    startTransition(async () => {
      const response = await sendOrganizationInvite(values, organizationId);
      console.log("Response: ", response);
      if (response.success) {
        console.log("Users added successfully");
      } else {
        console.log("Error adding users: ", response.error);
      }
    });
  };

  return (
    <Form {...addUsersForm}>
      <form
        onSubmit={addUsersForm.handleSubmit(onSubmit)}
        className="space-y-6 w-full"
      >
        <div className="space-y-2">
          <FormField
            control={addUsersForm.control}
            name="emails"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="org-name">
                  Enter a comma separated list of emails
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="invite-emails"
                    placeholder="email@email.com, email@example.com"
                    rows={3}
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {isPending ? "Adding Users..." : "Add Users"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
