"use client";

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
import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LinkWithArrow from "@/components/common/LinkWithArrow";

export default function AddUsersToOrganization({
  organizationId,
}: {
  organizationId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isFormDisabled, setFormDisabled] = useState(false);

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
      await sendOrganizationInvite(values, organizationId).then((res) => {
        if (!res.success) {
          console.log("Error adding users: ", res.error);
          setMessage(
            addUsersForm.formState.errors.emails?.message || "An error occurred"
          );
        } else {
          setMessage("Users have been notified");
          setFormDisabled(true);
        }
      });
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
                <FormLabel htmlFor="invite-emails">
                  Enter a comma-separated list of emails
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="invite-emails"
                    placeholder="email@email.com, email@example.com"
                    rows={3}
                    required
                    {...field}
                    disabled={isFormDisabled}
                  />
                </FormControl>
                {message && <FormMessage>{message}</FormMessage>}
              </FormItem>
            )}
          />

          {isFormDisabled ? (
            <div className="mt-4 text-center">
              <LinkWithArrow href="/onboarding/finalize">
                Proceed to Finalize Onboarding
              </LinkWithArrow>
            </div>
          ) : (
            <Button type="submit" disabled={isFormDisabled || isPending}>
              {isPending ? "Adding Users..." : "Add Users"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
