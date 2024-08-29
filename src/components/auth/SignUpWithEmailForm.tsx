"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { signUpSchema } from "@/schemas/auth-schemas";
import { signUp } from "@/actions/actions.auth";

export default function SignUpWithEmailForm({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      token: token,
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    startTransition(async () => {
      const res = await signUp(data);
      if (!res.success) {
        setMessage(res.error || "An error occurred");
      } else {
        setMessage("Account created successfully. You can now sign in.");
      }
    });
  };

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="info@credstaash.com"
                  type="email"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" type="text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="token"
          control={form.control}
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormMessage className="text-primary">{message}</FormMessage>
        <Button type="submit" className="w-full" aria-disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
