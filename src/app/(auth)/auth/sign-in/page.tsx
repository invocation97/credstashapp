import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "lucide-react";

export default function SignIn() {
  const handleSignIn = async (formData: FormData) => {
    "use server";
    await signIn("google", {
      redirectTo: "/dashboard",
    });
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-11">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
        Sign in to <span className="custom-gradient">Get Started</span>
      </h2>
      <form
        action={handleSignIn}
        className="flex items-center justify-center w-full"
      >
        <Button type="submit" variant="outline" className="w-full">
          <ChromeIcon className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>
      </form>
    </div>
  );
}
