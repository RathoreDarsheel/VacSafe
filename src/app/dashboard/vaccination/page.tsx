import { VaccinationTable } from '@/components/dashboard/vaccination-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NextDoseReminder } from '@/components/dashboard/next-dose-reminder';

export default function VaccinationPage() {
  return (
    <div className="space-y-6">
      <NextDoseReminder />
      <div>
        <h3 className="text-2xl font-bold tracking-tight">
          Recommended Vaccinations
        </h3>
        <p className="text-sm text-muted-foreground">
          Based on national and international health guidelines.
        </p>
      </div>
      <VaccinationTable />
    </div>
  );
}
