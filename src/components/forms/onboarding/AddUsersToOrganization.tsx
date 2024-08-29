"use client";

import { sendOrganizationInvite } from "@/actions/actions.resend";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addUsersToOrganizationSchema } from "@/schemas/onboarding-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, XCircle } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof addUsersToOrganizationSchema>;

type StepType = "adding" | "added";

export default function AddUsersToOrganization({
  organizationId,
  step,
}: {
  organizationId: string;
  step: StepType;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isFormDisabled, setFormDisabled] = useState<boolean>(step === "added");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const addUsersForm = useForm<FormValues>({
    resolver: zodResolver(addUsersToOrganizationSchema),
    defaultValues: {
      emails: [""], // Ensure there is always one input for email
    },
  });

  const { fields, append, remove } = useFieldArray<FormValues>({
    control: addUsersForm.control,
    rules: { minLength: 1 },
    /* @ts-ignore */
    name: "emails",
  });

  useEffect(() => {
    setFormDisabled(step === "added");
  }, [step]);

  const onSubmit = async (values: FormValues) => {
    setMessage(null);
    startTransition(async () => {
      const response = await sendOrganizationInvite(values, organizationId);
      if (!response.success) {
        setMessage(response.error || "An error occurred");
        console.error("Response error: ", response.error);
      } else {
        setMessage(`${response.invites?.length} user(s) have been notified`);
        setFormDisabled(true);

        const newParams = new URLSearchParams(searchParams);
        newParams.set("step", "added");
        router.push(`${pathname}?${newParams.toString()}`);
      }
    });
  };

  return (
    <Form {...addUsersForm}>
      <form
        onSubmit={addUsersForm.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md mx-auto"
      >
        <Card className="space-y-4">
          <CardHeader className="space-y-4">
            <CardTitle>Add Users to Organization</CardTitle>
            <CardDescription>
              Add users to your organization by entering their email addresses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={addUsersForm.control}
                name={`emails.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={`email-${index}`} className="sr-only">
                      {index === 0
                        ? "Email address"
                        : `Additional email ${index + 1}`}
                    </FormLabel>
                    <div className="flex flex-col items-start space-y-2">
                      <FormLabel>
                        {index === 0
                          ? "Email address"
                          : `Additional email ${index + 1}`}
                      </FormLabel>
                      <div className="flex items-center gap-2 w-full">
                        <FormControl className="w-full">
                          <Input
                            id={`email-${index}`}
                            placeholder={
                              index === 0
                                ? "Enter email address"
                                : "Enter additional email"
                            }
                            {...field}
                            disabled={isFormDisabled}
                            className="flex-1"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={isFormDisabled || fields.length === 1}
                          className="shrink-0 self-end"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              /* @ts-ignore */
              onClick={() => append("")}
              disabled={isFormDisabled}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Invite another user
            </Button>
          </CardFooter>
          <CardFooter className="flex flex-col items-center gap-4">
            {message && <p className="text-sm text-rose-600">{message}</p>}

            <Button
              type="submit"
              disabled={isFormDisabled || isPending}
              className="w-full"
            >
              {isPending ? "Adding Users..." : "Add Users"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
