import SettingsTemplate from "@/components/layout/SettingsTemplate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsTemplate>{children}</SettingsTemplate>;
}
