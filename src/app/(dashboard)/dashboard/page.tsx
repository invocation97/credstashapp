import { auth } from "@/auth";
import { SignOut } from "@/components/auth/SignOut";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }
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
