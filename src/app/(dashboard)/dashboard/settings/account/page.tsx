import { auth } from "@/auth";
import AccountSettingsForm from "@/components/forms/settings/AccountSettingsForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function AccountSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = session.user;

  if (!user) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 max-w-md">
        <AccountSettingsForm initialData={user} />
      </CardContent>
    </Card>
  );
}
