"use client";
import { finalizeOnboarding } from "@/actions/actions.onboarding";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { finalizeOnboardingSchema } from "@/schemas/onboarding-schemas";
import { SquareArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function FinalizeOnboarding({ user }: { user: any }) {
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const finalizeForm = useForm<z.infer<typeof finalizeOnboardingSchema>>();

  const onSubmit = async () => {
    startTransition(async () => {
      await finalizeOnboarding(user).then((res) => {
        if (!res.success) {
          console.log("Error finalizing onboarding: ", res.error);
        } else {
          push(`/dashboard`);
        }
      });
    });
  };

  return (
    <Form {...finalizeForm}>
      <form onSubmit={finalizeForm.handleSubmit(onSubmit)}>
        <FormField
          name="finalize"
          control={finalizeForm.control}
          render={({ field }) => (
            <div className="text-center">
              <Input {...field} type="submit" hidden className="hidden" />
              <Button type="submit" variant="outline">
                {isPending
                  ? "Getting things ready... "
                  : `Go to your organization's dashboard`}
                <SquareArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        />
      </form>
    </Form>
  );
}
