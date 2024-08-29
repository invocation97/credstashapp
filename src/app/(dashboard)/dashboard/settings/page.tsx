import GeneralSettingsForm from "@/components/forms/settings/GeneralSettingsForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your general preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <GeneralSettingsForm />
      </CardContent>
    </Card>
  );
}
