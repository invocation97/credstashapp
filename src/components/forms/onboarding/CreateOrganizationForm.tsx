"use client";

import { useState, useTransition } from "react";
import { createOrganization } from "@/actions/actions.onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createOrganizationSchema } from "@/schemas/onboarding-schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateOrganizationForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createOrgForm = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createOrganizationSchema>) => {
    startTransition(async () => {
      const { name } = values;
      try {
        const response = await createOrganization(name, user).then((res) => {
          if (res.success) {
            setIsComplete(true);
          } else {
            setError(res.message);
          }
        });
      } catch (error) {
        console.error("Error creating organization:", error);
      }
    });
  };

  return (
    <Form {...createOrgForm}>
      <form
        onSubmit={createOrgForm.handleSubmit(onSubmit)}
        className="space-y-6 w-full"
      >
        <div className="space-y-2">
          <FormField
            control={createOrgForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="add-users-to-org">
                  Organization Name
                </FormLabel>
                <FormControl>
                  <Input
                    id="add-users-to-org"
                    type="text"
                    placeholder="Enter your organization name"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage>{error}</FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit">
            {isPending ? "Creating..." : "Create Organization"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
