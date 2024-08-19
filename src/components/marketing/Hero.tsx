import { buttonVariants } from "../ui/button";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="w-full flex items-center relative overflow-hidden min-h-[calc(100vh-4rem)]"
    >
      <div className="absolute -z-10 inset-0 h-full w-full bg-primary/5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="container space-y-4 px-4 md:px-6 text-center relative z-10">
        <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-4">
          Try it for free $
        </div>
        <h1 className="text-3xl max-w-[950px] mx-auto font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Comprehensive solution for securely storing{" "}
          <span className="custom-gradient">credentials</span>
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          Store API keys, database credentials, and other sensitive information
          securely in one place. Share them with your team and centralize your
          secrets management.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link
            href="/auth/sign-in"
            className={buttonVariants({ variant: "default" })}
          >
            Get Started
          </Link>
          <Link
            href="#product"
            className={buttonVariants({ variant: "outline" })}
          >
            Learn More
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
