import Image from "next/image";
import React from "react";

export default function ProductPromo() {
  return (
    <section
      id="product"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted relative isolate"
    >
      <div className="absolute inset-0 w-full h-full -z-10 protruding-squares bg-repeat opacity-25" />
      {/* <div className="absolute inset-x-0 top-0 h-[100px] bg-gradient-to-b from-muted to-transparent" /> */}
      <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Streamline Your Web Development
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Our platform provides the tools and infrastructure you need to
              build, deploy, and scale your web applications with ease.
            </p>
          </div>
        </div>
        <Image
          src="/hero.webp"
          width="550"
          height="400"
          alt="Product"
          className="mx-auto aspect-[4/3] overflow-hidden rounded-t-3xl object-cover"
        />
      </div>
    </section>
  );
}
