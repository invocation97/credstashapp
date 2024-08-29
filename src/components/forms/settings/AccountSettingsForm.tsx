"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { accountSettingsSchema } from "@/schemas/settings-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AccountSettingsForm({
  initialData,
}: {
  initialData: User;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof accountSettingsSchema>>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      name: initialData.name || "",
    },
  });

  const onSubmit = async (formData: any) => {
    startTransition(() => {
      console.log("Form data:", formData);
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormControl>
                <Input id="name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
