import { auth } from "@/auth";
import { SignOut } from "@/components/auth/SignOut";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const isOnboarding = session?.user?.didFinishOnboarding === false;

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (!isOnboarding) {
    redirect(`/dashboard`);
  }
  return (
    <div className="mx-auto relative min-h-dvh flex justify-center items-center max-w-3xl space-y-8 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 h-16">
        <SignOut>(╯°□°)╯︵ ┻━┻</SignOut>
      </div>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
}
