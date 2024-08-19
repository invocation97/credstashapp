import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";

export default function LinkWithArrow({
  children,
  href,
  target = "_self",
}: {
  children: React.ReactNode;
  href: string;
  target?: string;
}) {
  return (
    <Link
      className={cn(buttonVariants({ variant: "link" }), "underline group ")}
      href={href}
    >
      {children}
      {target === "_self" ? (
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
      ) : (
        <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
      )}
    </Link>
  );
}
