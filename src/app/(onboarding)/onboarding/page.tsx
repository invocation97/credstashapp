import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Get started with your new organization
      </h1>
      <p className="text-muted-foreground">
        Follow these simple steps to set up your organization.
      </p>
      <Link
        className={cn(buttonVariants({ variant: "link" }), "underline group ")}
        href="/onboarding/create-organization"
      >
        {`Let's get started`}
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
      </Link>
    </div>
  );
}
