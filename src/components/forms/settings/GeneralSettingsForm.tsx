"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { generalSettingsSchema } from "@/schemas/settings-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function GeneralSettingsForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      darkMode: false,
    },
  });

  const onSubmit = async (formData: z.infer<typeof generalSettingsSchema>) => {
    startTransition(() => {
      console.log("Form data:", formData);
    });
  };

  console.log("Form errors:", form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="emailNotifications"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start gap-2">
              <FormLabel htmlFor="notifications">Email Notifications</FormLabel>
              <FormControl>
                <Switch
                  id="notifications"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage>{message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name="darkMode"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start gap-2">
              <FormLabel htmlFor="darkMode">Theme</FormLabel>
              <FormControl>
                <Switch
                  id="darkMode"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage>{message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit" aria-disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
