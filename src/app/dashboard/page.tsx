import { AgeGroupCoverage } from '@/components/dashboard/age-group-coverage';
import { OverviewStats } from '@/components/dashboard/overview-stats';
import { ReminderSettings } from '@/components/dashboard/reminder-settings';
import { RiskSimulator } from '@/components/dashboard/risk-simulator';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-1 lg:col-span-3">
        <h1 className="text-3xl font-bold text-foreground">
          Community Health Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome! Here's an overview of your community's vaccination status.
        </p>
      </div>

      <div className="col-span-1 lg:col-span-3">
        <OverviewStats />
      </div>

      <div className="col-span-1 lg:col-span-2">
        <AgeGroupCoverage />
      </div>

      <div className="col-span-1">
        <ReminderSettings />
      </div>

      <div className="col-span-1 lg:col-span-3">
        <RiskSimulator />
      </div>
    </div>
  );
}
