import React from "react";

const features = [
  {
    title: "Rapid Deployment",
    description:
      "Deploy your code with a single click and scale your application on-demand.",
  },
  {
    title: "Powerful Analytics",
    description:
      "Get real-time insights into your application's performance and user behavior.",
  },
  {
    title: "Seamless Collaboration",
    description:
      "Streamline your team's workflow with built-in code review and project management tools.",
  },
  {
    title: "Secure Infrastructure",
    description:
      "Protect your data and applications with our enterprise-grade security features.",
  },
  {
    title: "Scalable Performance",
    description:
      "Handle traffic spikes and scale your application with ease using our global edge network.",
  },
  {
    title: "Customizable Workflows",
    description:
      "Tailor our platform to your team's unique needs with our extensive customization options.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 relative isolate"
    >
      <div className="tortoise-shell absolute inset-0 -z-10 w-full h-full"></div>
      <div className="container space-y-12 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Features That Matter
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform is packed with features to help you build and deploy
              your web applications faster than ever before.
            </p>
          </div>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="grid gap-1">
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
