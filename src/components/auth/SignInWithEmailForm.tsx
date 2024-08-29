"use client";

import { signInWithEmail } from "@/actions/actions.auth";
import { loginSchema } from "@/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { redirect, useRouter } from "next/navigation";

export default function SignInWithEmailForm() {
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      await signInWithEmail(data).then((res) => {
        console.log("Response from form: ", res);
        if (!res.success) {
          setMessage(res.error!);
          console.log(res.message);
        } else {
          setMessage(res.message!);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 flex-1"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Input required {...field} placeholder="email@credstashapp.com" />
            </FormItem>
          )}
        />
        <FormMessage className="text-primary">{message}</FormMessage>
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          aria-disabled={isPending}
        >
          {isPending ? "Loading..." : "Sign in with Email"}
        </Button>
      </form>
    </Form>
  );
}
