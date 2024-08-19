import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: { name: string; href: string }[];
}) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index, array) => (
          <React.Fragment key={breadcrumb.name}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  className={cn(index === array.length - 1 && "font-bold")}
                  href={breadcrumb.href}
                >
                  {breadcrumb.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < array.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
