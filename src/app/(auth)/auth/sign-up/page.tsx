import { handleSignIn } from "@/actions/actions.auth";
import { auth } from "@/auth";
import SignInWithEmailForm from "@/components/auth/SignInWithEmailForm";
import SignUpWithEmailForm from "@/components/auth/SignUpWithEmailForm";
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SignUp({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;

  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center space-y-4">
      <h2 className="my-6 text-center text-3xl font-bold tracking-tight text-foreground">
        Sign in to <span className="custom-gradient">Get Started</span>
      </h2>
      <SignUpWithEmailForm token={token} />
      <div className="flex items-center justify-center gap-2 w-full">
        <div className="w-[20%] h-px bg-primary"></div>
        <span>or</span>
        <div className="w-[20%] h-px bg-primary"></div>
      </div>
      <form
        action={handleSignIn}
        className="flex items-center justify-center w-full"
      >
        <Button type="submit" variant="outline" className="w-full">
          <ChromeIcon className="mr-2 size-6" />
          Sign in with Google
        </Button>
      </form>
    </div>
  );
}
