import { auth } from "@/auth";
import FinalizeOnboarding from "@/components/forms/onboarding/FinalizeOnboarding";
import { CheckIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react";
import React from "react";

export default async function FinalizeOnboardingPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const user = session?.user;

  if (!user) {
    return null;
  }
  return (
    <div className="relative max-w-md mx-auto text-center">
      <div className="space-y-6">
        <div className="space-y-20">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foregroud">
              Your organization is ready!
            </h2>
            <p className="text-muted-foreground">
              Here are some helpful tips to get you started
            </p>
          </div>
          <div className="grid gap-6">
            <div className="flex items-start gap-4">
              <CheckIcon className="h-8 w-14 p-1 bg-foreground text-background rounded-[100vmax] self-center" />

              <div>
                <h3 className="font-medium">Invite your team</h3>
                <p className="text-muted-foreground">
                  Add your team members to collaborate on projects and tasks.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <SettingsIcon className="h-8 w-14 p-1 bg-foreground text-background rounded-[100vmax] self-center" />

              <div>
                <h3 className="font-medium">Customize your settings</h3>
                <p className="text-muted-foreground">
                  {` Adjust your organization's settings to fit your needs.`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <LayoutDashboardIcon className="h-8 w-14 p-1 bg-foreground text-background rounded-[100vmax] self-center" />

              <div>
                <h3 className="font-medium">Explore the dashboard</h3>
                <p className="text-muted-foreground">
                  Check out the dashboard to manage your organization.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <FinalizeOnboarding user={user} />
        </div>
      </div>
    </div>
  );
}
