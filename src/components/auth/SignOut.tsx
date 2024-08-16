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
      <p>{children}</p>
      <button type="submit">Sign out</button>
    </form>
  );
}
