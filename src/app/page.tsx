import { auth, signOut } from "@/auth";
import { SignOut } from "@/components/auth/SignOut";
import Link from "next/link";

export default async function Page() {
  const session = await auth();
  const user = session?.user?.name;

  return (
    <section>
      <h1>Home</h1>
      {/* <div>{user ? <SignOut>{`Welcome ${user}`}</SignOut> : <SignIn />}</div>
       */}
      {user ? (
        <div>
          {`Welcome ${user}`}
          <SignOut>: </SignOut>
        </div>
      ) : (
        <>
          <Link href="/auth/sign-in">Sign in</Link>
        </>
      )}
    </section>
  );
}
