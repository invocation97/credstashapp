import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "lucide-react";

export default function SignIn() {
  const handleSignIn = async (formData: FormData) => {
    "use server";
    console.log(formData.get("email")); // Add this line to debug
    await signIn("google", {
      redirectTo: "/onboarding",
    });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
        Sign in to your account
      </h2>
      <form action={handleSignIn} className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-full">
            <Button type="submit" variant="outline" className="w-full">
              <ChromeIcon className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
