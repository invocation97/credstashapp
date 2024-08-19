import { MountainIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link
        href="/"
        className="flex items-center justify-center"
        prefetch={false}
      >
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          href="#hero"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Hero
        </Link>
        <Link
          href="#product"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Product
        </Link>
        <Link
          href="#features"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Features
        </Link>
      </nav>
    </header>
  );
}
