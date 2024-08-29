import { signOut } from "@/auth";

export function SignOut({ children }: { children: React.ReactNode }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/auth/sign-in",
        });
      }}
    >
      <button type="submit">{children}</button>
    </form>
  );
}
