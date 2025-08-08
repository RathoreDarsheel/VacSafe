import { SettingsForm } from '@/components/dashboard/settings-form';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and personal details.
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
