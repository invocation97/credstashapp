import { auth } from "@/auth";
import db from "@/lib/db";

export default async function VerifyRequestPage() {
  const session = await auth();

  if (!session?.user?.email) return null;

  const user = await db.user.findUnique({
    where: { email: session.user?.email },
  });

  console.log(user);

  return <div>page</div>;
}
