"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbs = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Settings", href: "/dashboard/settings" },
];

const settingsTabs = [
  { name: "General", href: "/dashboard/settings" },
  { name: "Account", href: "/dashboard/settings/account" },
  { name: "Organization", href: "/dashboard/settings/organization" },
];

export default function SettingsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Tabs defaultValue={pathname} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {settingsTabs.map((tab) => (
            <TabsTrigger key={tab.href} value={tab.href} asChild>
              <Link href={tab.href}>{tab.name}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="mt-6">{children}</div>
    </div>
  );
}
